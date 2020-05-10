from django.db import models

# Create your models here.

class Restaurant(models.Model):
    title = models.CharField(max_length=100)
    crossroads = models.TextField(default = "")
    genre = models.TextField(default = "")
    vegetarianOptions = models.TextField(default = "")
    isActive = models.IntegerField()
    price = models.TextField(default = "")
    seating = models.TextField(default = "")
    region = models.TextField(default = "")
    score = models.IntegerField(default=0)
    usernamesVotedUp = models.TextField(default = "", null=True, blank=True)
    usernamesVotedDown = models.TextField(default = "", null=True, blank=True)
    link = models.TextField(default = "")

class filters(models.Model):
    #unique title of the url for the instance
    title = models.CharField(max_length=100)
    #We need to have a method for the scores of each filter
    #actaully, we'll just encript the whole thing in text as a json and forget about it
    restaurantInfo = models.TextField(default='0')
    filterInfo = models.TextField(default='0')
    filterUsernamesVotedUp = models.TextField(default="")
    filterUsernamesVotedDown = models.TextField(default="")



def __str__(self):
    return self.title


