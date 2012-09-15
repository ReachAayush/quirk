from django.shortcuts import get_object_or_404, render_to_response
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.urlresolvers import reverse
from django.template import RequestContext
from quirk.quirkapp.models import Task, Screen, Response
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

# Bulk add song (via post)
@csrf_exempt
def new_task(request):
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