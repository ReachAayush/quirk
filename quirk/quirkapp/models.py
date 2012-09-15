from django.db import models
from django import forms

#model for the developer's task
class Task(models.Model):
	#task name
	name = models.CharField(max_length=200)
	#description
	description = models.CharField()
	#taskID
	taskID = models.CharField(max_length=10, unique=True)
	
#model for each screen in the Task
class Screen(models.Model):
	#task that this screen is part of
	task = models.ForeignKey(Task)

	# todo?? iterate automatically?
	screenID = models.CharField(max_length=3, unique=True)

	#(x1,y1,x2,y2)
	nextButtonCoords = models.CommaSeparatedIntegerField(max_length=4)

	nextButtonLabel = models.CharField(max_length=200)

	image = models.URLField(max_length=200)
	

#model for the individual users' response
class Response(models.Model):
	#demographics
	#age group
	18- 18-24 25-40 40-60 61+
	AGEGROUP1 = 1  #under 18
	AGEGROUP2 = 2  #18-24
	AGEGROUP3 = 3  #25-40
	AGEGROUP4 = 4  #41-60
	AGEGROUP5 = 5  #61 and over
	
	AGE_GROUPS = (
		(AGEGROUP1, 'group1'),
		(AGEGROUP1, 'group2'),
		(AGEGROUP1, 'group3'),
		(AGEGROUP1, 'group4'),
		(AGEGROUP1, 'group5'),
	)
	age_group = models.IntegerField(choices=GENDER_CHOICES, default=OTHER)


	#gender
	MALE = 'M'
	FEMALE = 'F'
	OTHER = 'O'
	GENDER_CHOICES = (
		(MALE, 'Male'),
		(FEMALE, 'Female'),
		(OTHER, 'Other'),
	)
	gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default=OTHER)
	
	#json response from client
	json=models.TextField()

	#task that this response refers to
	task = models.ForeignKey(Task)