from django.shortcuts import get_object_or_404, render_to_response
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.urlresolvers import reverse
from django.template import RequestContext
from quirk.quirkapp.models import Task, Screen, Response, Click
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
             
# Quirk newTask view
def newTask(request):
	return render_to_response('newtask.html', {}, context_instance=RequestContext(request))

# Quirk analytics view
def analytics(request, private_key):
	return render_to_response('analytics.html', {'privateKey': private_key}, context_instance=RequestContext(request))

# Quirk mobile view
def mobileView(request, public_key):
	return render_to_response('mobile.html', {'publicKey': public_key}, context_instance=RequestContext(request))

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
		screensCSV = str(request.POST['screens'])
		new_task.save()
		createScreens(screensCSV, new_task)
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
		if loc%6==0:
			URL = item
		elif loc%6==1:
			label = item
		elif loc%6==2:
			x1 = float(item)
		elif loc%6==3:
			y1 = float(item)
		elif loc%6==4:
			x2 = float(item)
		else:
			y2=float(item)

		if ((loc>0) and (loc%6 == 5)):
			new_screen(URL,label,x1,y1,x2,y2,task)

		loc+=1

#add a screenshot
def new_screen(URL,label,x1,y1,x2,y2,task):
	new_screen = Screen()
	new_screen.nextButtonX1 = x1
	new_screen.nextButtonY1 = y1
	new_screen.nextButtonX2 = x2
	new_screen.nextButtonY2 = y2
	new_screen.nextButtonLabel = label
	new_screen.imageURL = URL
	
	new_screen.task = task
	new_screen.save()

def getTask(request, public_key):
	task = get_object_or_404(Task, publicID=public_key)
	screens = getScreensPublic(public_key)

	response = dict()
	response[0] = [task.description]
	key = 1;
	for item in screens:
		val = [item.imageURL, item.nextButtonX1, item.nextButtonY1, item.nextButtonX2, item.nextButtonY2]
		response[key] = val
		key += 1

	return HttpResponse(simplejson.dumps(response),mimetype='application/json')

def getTaskViaPrivate(request, private_key):
	task = get_object_or_404(Task, privateID=private_key)
	screens = getScreensPrivate(private_key)

	response = dict()
	response[0] = [task.description]
	key = 1;
	for item in screens:
		val = [item.imageURL, item.nextButtonX1, item.nextButtonY1, item.nextButtonX2, item.nextButtonY2]
		response[key] = val
		key += 1

	return HttpResponse(simplejson.dumps(response),mimetype='application/json')

def getResponses(request, private_key):
	task = get_object_or_404(Task, privateID=private_key)
	#get responses, 1 for each user to complete the task.
	responses = Response.objects.filter(task__privateID=private_key).order_by('id')
	jsonData = list()
	#for each response
	for resp in responses:
		#ignore any gender/age data for now.
		clickArray = list()
		for clickData in (Click.objects.filter(response=resp).order_by('id')):
			clickArray.append(dict({'x': clickData.x, 'y': clickData.y, 'hit': clickData.hit, 'time':clickData.time, 'screen':clickData.screen}))
		jsonData.append(clickArray)
	return HttpResponse(simplejson.dumps(jsonData),mimetype='application/json')

#get screen's active coordinates
def getActiveArea(screen):
	return (screen.X1, screen.Y1, screen.X2, screen.Y2)

#get screens from a task's public id
def getScreensPublic(publicTaskID):
	screens = Screen.objects.filter(task__publicID=publicTaskID).order_by('id')
	return screens

#get screens from a task's private id
def getScreensPrivate(privateTaskID):
	screens = Screen.objects.filter(task__privateID=privateTaskID).order_by('id')
	return screens

#create a new response in the database
@csrf_exempt
def new_response(request, public_key):
	if request.method == 'POST':
		new_response = Response()
		new_response.task = get_object_or_404(Task, publicID=public_key)
		new_response.save()

		#new_response.gender = str(request.POST['gender'])
		#new_response.age_group = str(request.POST['age'])
		#new_response.jsonresponseData = str(request.POST['data'])
		jsonData = str(request.POST['log'])
		#clickCSV = str(request.POST['clicks'])
		data = simplejson.loads(jsonData)

		createClicks(data, new_response)
		
		#publicID = str(request.POST['publicID'])
		return HttpResponse('Success')
	else:
		return HttpResponse('Error')

def createClicks(data,new_response):
	#a json object(decoded) about the click
	screen = 0

	for key, value in data.iteritems(): #for each screen
		for click in value: # fo each click on screen
			x = click['x']
			y = click['y']
			time = click['timestamp']
			hit = click['hit']
			new_click(x,y,time,hit,screen,new_response)

		screen += 1

#add a click
def new_click(x,y,time,hit,screen,new_response):
	new_click = Click()
	new_click.x = x
	new_click.y = y
	new_click.time = time
	new_click.hit = hit
	new_click.screen = screen
	new_click.response = new_response
	new_click.save()
