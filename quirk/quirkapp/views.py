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

# Generate random
def newTaskID():
	randomString = ''.join(random.sample('abcdefghkmnopqrstuvwxyz23456789', 6))
	return randomString

#create a Task
@csrf_exempt
def new_task(request):
	if request.method == 'POST':
		new_task = Task()
		new_task.description = str(request.POST['taskDescription'])
		new_task.privateID = newTaskID()
		new_task.publicID = newTaskID()
		#screensCSV = str(request.POST['screens'])
		#createScreens(screensCSV,new_task)
		new_task.save()
		response = ({'privateID': new_task.privateID, 'publicID': new_task.publicID  })
		return HttpResponse(simplejson.dumps(response),mimetype='application/json')
	else:
		return HttpResponse('Error')

def createScreens(screenInfoCSV,task):
	#a comma-sepearted list of information about each screen
	# URL, label, x1, y1, x2, y2
	loc=0
	screensList = screenInfoCSV.split(",")
	for item in screensList:
		if loc%5==0:
			URL = item
		elif x%5==1:
			label = item
		elif x%5==2:
			x1 = float(item)
		elif x%5==3:
			y1 = float(item)
		elif x%5==4:
			x2 = float(item)
		else:
			y2=float(item) #y2 
		new_screen=new_screen(URL,label,x1,y1,x2,y2,task)
		loc+=1

#add a screenshot
def new_screen(URL,label,x1,y1,x2,y2,privateID):
	if request.method == 'POST':
		new_screen = Screen()
		new_screen.nextButtonX1 = x1
		new_screen.nextButtonY1 = y1
		new_screen.nextButtonX2 = x2
		new_screen.nextButtonY2 = y2
		new_screen.nextButtonLabel = label	
		new_screen.imageURL = URL
		
		new_screen.task = get_object_or_404(Task, privateID=privateID)
		new_screen.save()
		return HttpResponse('Success')
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

#get screen's nextButton coordinates
def getNextButtonCoords(request,screen):
	return (screen.X1, screen.Y1, screen.X2, screen.Y2)

#get screen's nextButton label
def getNextButtonLabel(request, screen):
	return screen.nextButtonLabel


#get screens from a task's public id
def getScreensFromPublicID(publicTaskID):
	queue = Song.objects.filter(task__publicID=publicTaskID).order_by('screenID')

#get screens from a task's private id
def getScreensFromPrivateID(privateTaskID):
	queue = Song.objects.filter(task__privateID=privateTaskID).order_by('screenID')





#### analytics helpers ####


