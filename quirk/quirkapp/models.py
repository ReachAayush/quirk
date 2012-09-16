from django.db import models
from django import forms

#model for the developer's task
class Task(models.Model):
	description = models.CharField(max_length=500)
	privateID = models.CharField(max_length=10, unique=True)
	publicID = models.CharField(max_length=10, unique=True)
	
#model for each screen in the Task
class Screen(models.Model):
	task = models.ForeignKey(Task)

	nextButtonX1 = models.IntegerField()
	nextButtonY1 = models.IntegerField()
	nextButtonX2 = models.IntegerField()
	nextButtonY2 = models.IntegerField()

	nextButtonLabel = models.CharField(max_length=200)
	imageURL = models.URLField(max_length=200)
	

#model for the individual users' response
class Response(models.Model):
	#demographics
	#age group
	AGEGROUP1 = 1  #under 18
	AGEGROUP2 = 2  #18-24
	AGEGROUP3 = 3  #25-40
	AGEGROUP4 = 4  #41-60
	AGEGROUP5 = 5  #61 and over
	
	AGE_GROUPS = (
		(AGEGROUP1, 'group1'),
		(AGEGROUP2, 'group2'),
		(AGEGROUP3, 'group3'),
		(AGEGROUP4, 'group4'),
		(AGEGROUP5, 'group5'),
	)

	age_group = models.IntegerField(choices=AGE_GROUPS, default=0)


	#gender
	MALE = 'M'
	FEMALE = 'F'
	OTHER = 'O' # letter, not number.

	GENDER_CHOICES = (
		(MALE, 'Male'),
		(FEMALE, 'Female'),
		(OTHER, 'Other'),
	)

	gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default=OTHER)
	
	#json response from client
	jsonResponceData=models.TextField()

	#task that this response refers to
	task = models.ForeignKey(Task)