from django.db import models
from django import forms
from datetime import datetime

class Party(models.Model):
	partyID = models.CharField(max_length=10, unique=True)
	name = models.CharField(max_length=100)
	nowPlayingUri = models.CharField(max_length=200)
	nowPlayingTrack = models.CharField(max_length=200)
	nowPlayingArtist = models.CharField(max_length=200)
	latitude = models.CharField(max_length=65, null=True, blank=True)
	longitude = models.CharField(max_length=65, null=True, blank=True)
	county = models.CharField(max_length=65, null=True, blank=True)
	lastUpdated = models.DateTimeField()
	paused = models.BooleanField(default=False)
	def save(self):
		self.lastUpdated = datetime.now()
		super(Party, self).save()
	def __unicode__(self):
		return str(self.id)

class Song(models.Model):
	party = models.ForeignKey(Party)
	uri = models.CharField(max_length=200)
	track = models.CharField(max_length=200)
	artist = models.CharField(max_length=200)
	timestamp = models.DateTimeField(auto_now_add=True)
	upvotes = models.IntegerField(default=0)
	def __unicode__(self):
		return self.uri 

class songForm(forms.ModelForm):
	class Meta:
		model = Song
		exclude = ('timestamp', 'upvotes')


#model for the developer's task
class Task(models.Model):
	#task name
	name = models.CharField(max_length=200)
	#description
	description = models.CharField()
	#taskID
	taskID = models.CharField(max_length=10, unique=True)
	
	#screens


	#responses

#model for each screen in the Task
class Screen(models.Model)
	

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
	age_group = models.IntegerField(choices=GENDER_CHOICES,
                                    default=OTHER)


	#gender
	MALE = 'M'
    FEMALE = 'F'
    OTHER = 'O'
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (OTHER, 'Other'),
    )
    gender = models.CharField(max_length=1,
                              choices=GENDER_CHOICES,
                              default=OTHER)

	
	#json response from client
	json=models.TextField()

