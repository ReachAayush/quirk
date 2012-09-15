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
def example(request):
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

# Generate random
def newTaskID():
	randomString = ''.join(random.sample('abcdefghkmnopqrstuvwxyz23456789', 6))
	return randomString

#create a Task
def new_task(request):
	if request.method == 'POST':
		new_task = Task()
		new_task.taskName = str(request.POST['taskName'])
		new_task.description = str(request.POST['taskDescription'])
		new_task.privateID = newTaskID()
		new_task.publicID = newTaskID()
		new_task.save()
		response = ({ 'taskName': new_task.taskName , 'privateID': new_task.privateID, 'publicID': new_task.publicTaskID  })
		return HttpResponse(simplejson.dumps(response),mimetype='application/json')
	else:
		return HttpResponse('Error')

#retrieve a task by its public id task
def get_task_public(request, publicID):
	task = Task.objects.get(publicID=publicID)
		return task

#retrieve a task by its private id task
def get_task_private(request, privateID):
	task = Task.objects.get(privateID=privateID)
		return task

#create a new responce
def new_responce(request):
	if request.method == 'POST':
		new_responce = Response()
		new_responce.gender = str(request.POST['gender'])
		new_responce.age_group = str(request.POST['age'])
		new_responce.jsonResponceData = str(request.POST['data'])
		
		publicID = str(request.POST['publicID'])
		new_responce.task = get_object_or_404(Task, publicID=publicID)
		new_responce.save()
		return HttpResponse('Success')
	else:
		return HttpResponse('Error')

#add a screenshot
def new_screen(request):
	if request.method == 'POST':
		new_screen = Screen()
		new_screen.nextButtonX1 = float(request.POST['X1'])
		new_screen.nextButtonY1 = float(request.POST['Y1'])
		new_screen.nextButtonX2 = float(request.POST['X2'])
		new_screen.nextButtonY2 = float(request.POST['Y2'])
		new_screen.nextButtonLabel = str(request.POST['buttonLabel'])		
		new_screen.imageURL = str(request.POST['imageURL'])
		
		privateID = str(request.POST['privateID'])
		new_screen.task = get_object_or_404(Task, privateID=privateID)
		new_screen.save()
		return HttpResponse('Success')
	else:
		return HttpResponse('Error')

#get screen's nextButton coordinates

#get screen's nextButton label


#### analytics helpers ####


