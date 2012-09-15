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

l

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