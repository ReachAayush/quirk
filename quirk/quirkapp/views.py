from django.shortcuts import get_object_or_404, render_to_response
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.urlresolvers import reverse
from django.template import RequestContext
from quirk.quirkapp.models import Party, Song
from django.utils import simplejson
from django.core import serializers
from datetime import datetime
import urllib2
import json
import random
import math
import string

# Home page
def home(request):
	return render_to_response('index.html', {}, context_instance=RequestContext(request))
                               
# Rukkus mobile view
def mobileView(request, party_id):
	return render_to_response('rukkus.html', {'partyID': party_id}, context_instance=RequestContext(request))
                               
# Generate random
def newPartyCode():
	randomString = ''.join(random.sample('abcdefghkmnopqrstuvwxyz23456789', 6))
	return randomString

# Return new party
def new_party(request, security_code, party_name):
	if (security_code == '90h3jk0bzgnqj25'):
		new_party = Party()
		new_party.partyID = newPartyCode()
		new_party.nowPlaying = "null"
		new_party.name = party_name
		new_party.save()
		partyID = new_party.partyID
		response = ({ 'partyID': partyID, 'partyName': party_name })
		return HttpResponse(simplejson.dumps(response),mimetype='application/json')
	else:
		return HttpResponse('Error')

# Delete a Rukkus
def delete_rukkus(request, party_id, security_code):
	if (security_code == '90h3jk0bzgnqj25'):
		party = Party.objects.get(partyID=party_id)
		party.delete()
		return HttpResponse('Success')
	else:
		return HttpResponse('Error')

# Pause a Rukkus
def pause_rukkus(request, party_id, security_code):
	if (security_code == '90h3jk0bzgnqj25'):
		party = Party.objects.get(partyID=party_id)
		party.paused = True
		party.save()
		return HttpResponse('Success')
	else:
		return HttpResponse('Error')

# Restore a Rukkus
def restore_rukkus(request, party_id, security_code):
	if (security_code == '90h3jk0bzgnqj25'):
		party = Party.objects.get(partyID=party_id)
		party.paused = False
		party.save()
		return HttpResponse('Success')
	else:
		return HttpResponse('Error')
	
# Add geolocation to party
def add_geo(party_id, latitude, longitude, county):
	party = get_object_or_404(Party, partyID=party_id)
	party.latitude = latitude
	party.longitude = longitude
	party.county = county
	party.save()
	return HttpResponse('Added geo')

# Geocodes an address
def geocodeAddress(request, party_id, security_code, address):
	if (security_code == '90h3jk0bzgnqj25'):
		add = urllib2.quote(address)
		geocode_url = "http://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=false" % add
		req = urllib2.urlopen(geocode_url)
		jsonResponse = json.loads(req.read())
		description = jsonResponse['results'][0]['address_components']
		geometry = jsonResponse['results'][0]['geometry']
		
		for i in xrange(len(description)):
			if (description[i]['types'][0] == 'administrative_area_level_2'):
				county = description[i]['long_name']
		
		latitude = geometry['location']['lat']
		longitude = geometry['location']['lng']
		
		add_geo(party_id, latitude, longitude, county)
		
		return HttpResponse('Success') 
			
	else:
		return HttpResponse('Error') 

# Return a list of nearby parties
def find_nearby(request, latitude, longitude, estCounty):
	parties = Party.objects.filter(county=estCounty, paused=False)
	distances = list()
	closestParty = int()
	closestPartyDistance = 0
	closestPartyFound = False
	closestPartiesList = list()
	radiusSize = .5
	
	# Computes distances and finds the closest distance
	for i in xrange(len(parties)):
		distance = pointDistance(latitude, longitude, parties[i].latitude, parties[i].longitude)
		distances.append(distance)
		if ((closestPartyFound == False) or (distance < closestPartyDistance)):
			closestPartyDistance = distance
			closestParty = i
			closestPartyFound = True

	# Sets the radius size
	if (len(parties) < 3):
		radiusSize = 1
			
	if ((closestPartyDistance < radiusSize) and (closestPartyDistance != 0)):
		closestPartiesList.append([parties[closestParty].name, int(closestPartyDistance*1609.344), parties[closestParty].partyID])
		for i in xrange(len(distances)):
			if ((closestPartyDistance/distances[i]) > .32):
				if (i != closestParty):
					closestPartiesList.append([parties[i].name, int(distances[i]*1609.344), parties[i].partyID])
	
	key = 1
	response = dict()
	for item in closestPartiesList:
		val = item
		response[key] = val
		key += 1
	
	return HttpResponse(simplejson.dumps(response),mimetype='application/json')
		
# Computes the distance between two points
def pointDistance(lat1, long1, lat2, long2):
	lat1 = float(lat1)
	long1 = float(long1)
	lat2 = float(lat2)
	long2 = float(long2)
	degrees_to_radians = math.pi/180.0
	phi1 = (90.0 - lat1)*degrees_to_radians
	phi2 = (90.0 - lat2)*degrees_to_radians
	theta1 = long1*degrees_to_radians
	theta2 = long2*degrees_to_radians
	cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + math.cos(phi1)*math.cos(phi2))
	arc = math.acos( cos )
	arc = arc*3960
	return arc

# Add song (via get)
def add_song(request, party_id, song_uri, song_name, song_artist):
	party = get_object_or_404(Party, partyID=party_id)
	song_uri = song_uri.replace(':', '%3A')
	if (song_uri != party.nowPlayingUri):
		song = Song.objects.filter(party__partyID=party_id,uri=song_uri)
		if (len(song) > 0):
			song = song[0]
			song.upvotes = song.upvotes + 1
			song.save()
		else:
			new_song = Song()
			new_song.uri = song_uri
			new_song.track = song_name
			new_song.artist = song_artist
			new_song.upvotes = 1
			new_song.party = party
			new_song.save()
	return HttpResponse('Success')

# Bulk add song (via post)
@csrf_exempt
def bulk_add_song(request, security_code):
	if (security_code == '90h3jk0bzgnqj25'):
		if request.method == 'POST':
			party_id = str(request.POST['partyID'])
			nameList = str(request.POST['nameList']).split('*@_*')
			artistList = str(request.POST['artistList']).split('*@_*')
			uriList = str(request.POST['uriList']).split('*@_*')

			party = get_object_or_404(Party, partyID=party_id)

			for i in range(len(nameList)):
				if (uriList[i] != ""):
					song = Song.objects.filter(party__partyID=party_id,uri=uriList[i])
					if (len(song) == 0):
						new_song = Song()
						new_song.uri = uriList[i]
						new_song.track = nameList[i]
						new_song.artist = artistList[i]
						new_song.upvotes = 1
						new_song.party = party
						new_song.save()

		return HttpResponse('Success')
	
	else:
		return HttpResponse('Success')
	
# Delete song
def delete_song(request, party_id, security_code, uriID):
	uriID = uriID.replace(':', '%3A')
	if (security_code == '90h3jk0bzgnqj25'):
		song = Song.objects.filter(party__partyID=party_id,uri=uriID)
		if len(song):
			song = song[0]
			song.delete() 
		response = prepare_queue(party_id)
		return HttpResponse(simplejson.dumps(response),mimetype='application/json')
	else:
		return HttpResponse('Error')
	
# Upvote song
def upvote_song(request, party_id, uriID):
	uriID = uriID.replace(':', '%3A')
	song = Song.objects.filter(party__partyID=party_id,uri=uriID)
	if len(song):
		song = song[0]
		song.upvotes = song.upvotes + 1
		song.save() 
	response = prepare_queue(party_id)
	return HttpResponse(simplejson.dumps(response),mimetype='application/json')

# Converts 1000 upvotes into 1k
def truncate_upvotes(item):
	item = int(item);
	if (item >= 1000):
		item /= 1000.0
		item = str(round(item, 2)) + "k"
		return item
	else:
		return item

# Build queue
def build_queue(party_id):
	queue = Song.objects.filter(party__partyID=party_id).order_by('-upvotes', 'timestamp')
	return queue
	
# Convert queue to Python dictionary
def prepare_queue(party_id):
	queue = build_queue(party_id)
	party = get_object_or_404(Party, partyID=party_id)
	response = dict()
	key = 1

	if ((party.nowPlayingUri == '') & (len(queue) > 0)):
		song_uri = queue[0].uri
		song_name = queue[0].track
		song_artist = queue[0].artist
		queue[0].delete()
		party.nowPlayingUri = song_uri
		party.nowPlayingTrack = song_name
		party.nowPlayingArtist = song_artist
		party.save()
		response[0] = [song_uri, song_name, song_artist]
		for item in queue:
			if (item.uri != song_uri):
				val = [item.uri, item.track, item.artist, truncate_upvotes(item.upvotes)]
				response[key] = val
				key += 1
	else:
		response[0] = [party.nowPlayingUri, party.nowPlayingTrack, party.nowPlayingArtist]
		for item in queue:
			val = [item.uri, item.track, item.artist, truncate_upvotes(item.upvotes)]
			response[key] = val
			key += 1

	return response
	
# Return queue
def return_queue(request, party_id):
	response = prepare_queue(party_id)
	return HttpResponse(simplejson.dumps(response),mimetype='application/json')

# Advance the playlist
def advance(request, party_id, security_code, next_uri):
	next_uri = next_uri.replace(':', '%3A')
	if (security_code == '90h3jk0bzgnqj25'):
		queue = build_queue(party_id)
		party = get_object_or_404(Party, partyID=party_id)
		partyID = party.id
		if (len(queue) > 1):
			nowPlaying = get_object_or_404(Song, party=partyID, uri=next_uri)
			party.nowPlayingUri = nowPlaying.uri
			party.nowPlayingTrack = nowPlaying.track
			party.nowPlayingArtist = nowPlaying.artist
			party.save()
			nowPlaying.delete()
		else:
			party.nowPlayingUri = ''
			party.nowPlayingTrack = ''
			party.nowPlayingArtist = ''
			party.save()
		response = prepare_queue(party_id)
		return HttpResponse(simplejson.dumps(response),mimetype='application/json')
	else:
		return HttpResponse('Error')