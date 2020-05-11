from django.shortcuts import render
from .models import Restaurant
from .models import filters
from django.utils.crypto import get_random_string
from django.forms.models import model_to_dict
from collections import OrderedDict


import json
import operator

from django.contrib.auth.decorators import login_required
from django.contrib.messages.views import SuccessMessageMixin
from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect, HttpResponse, Http404, request, JsonResponse
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator as activation_user
from django.template import loader
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views import View
from django.views.generic import ListView
from django.views.generic.detail import SingleObjectMixin
from django.views.generic.edit import CreateView, FormView, UpdateView, DeleteView, \
    FormMixin
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User, Group
from rest_framework import viewsets


from .models import *



from django.http import JsonResponse


contextPH = {
        'posts': Restaurant.objects.filter(region='PH')
    }

contextUC = {
        'posts': Restaurant.objects.filter(region='UC')
    }

#contextPH = {
#        'posts': Restaurant.objects.order_by('title')
#}

contextEL = {
        'posts': Restaurant.objects.filter(region='EL')
}
context2 = {
        'filtersServer':filters.objects.all()
}

context3 = {
    "UC":"University City",
    "EL":"East Lansing"
}

defaultFilters = {

    0:0,
    1:0,
    2:0,
    3:0,
    4:0,
    5:0,
    6:0,
    7:0,
    8:0,
    9:0,
    10:0,
    11:0,
    12:0,
    13:0,
    14:0,
    15:0,

}

defaultUsernamesVoted = {

    0:'',
    1:'',
    2:'',
    3:'',
    4:'',
    5:'',
    6:'',
    7:'',
    8:'',
    9:'',
    10:'',
    11:'',
    12:'',
    13:'',
    14:'',
    15:'',

}


def alphaUpdateServer(request):
    if request.is_ajax():


        filtersClient = json.loads(request.GET.get('clientFilters'))
        clientFilterUsernamesUp = json.loads(request.GET.get('clientFilterUsernamesUp'))
        clientFilterUsernamesDown = json.loads(request.GET.get('clientFilterUsernamesDown'))
        restaurantDict = json.loads(request.GET.get('values'))
        title = json.loads(request.GET.get('title'))
        instance = filters.objects.get(title=title)
        #Now we have the array with the proper information
        #We need to update the server's scores by encoding to a json and updating the database



        #Change the filters info in db
        instance.filterInfo = json.dumps(filtersClient)
        instance.filterUsernamesVotedUp = json.dumps(clientFilterUsernamesUp)
        instance.filterUsernamesVotedDown = json.dumps(clientFilterUsernamesDown)

        #Change the restaurant info in db and sort
        #sort then store in db then update once it gets sent back to the client
        if(type(restaurantDict) is list):
            values = restaurantDict

            counter=0
            newDict = {}
            for item in values:
                newDict.update({counter:values[counter]})
                counter=counter+1
            #print(newDict)

            sortedDictIndexes = sorted(newDict, key=lambda k:newDict[k]['score'], reverse=True)
            sortedDict = {}
            counter1 = 0
            for index in sortedDictIndexes:
                sortedDict.update({counter1:newDict[index]})
                counter1 = counter1+1



            instance.restaurantInfo = json.dumps(sortedDict)
            instance.save()
            return HttpResponse(json.dumps(sortedDict), content_type='application/json')
        elif(type(restaurantDict) is dict):
            values = restaurantDict

            counter=0
            newDict = {}
            for item in values:
                newDict.update({counter:values[str(counter)]})
                counter=counter+1
            #print(newDict)

            sortedDictIndexes = sorted(newDict, key=lambda k:newDict[k]['score'], reverse=True)
            sortedDict = {}
            counter1 = 0
            for index in sortedDictIndexes:
                sortedDict.update({counter1:newDict[index]})
                counter1 = counter1+1



            instance.restaurantInfo = json.dumps(sortedDict)
            instance.save()
            return HttpResponse(json.dumps(sortedDict), content_type='application/json')

    return render(request, 'blog/updateServerFilters.php')

def sortAlpha(request):
    if request.is_ajax():

        #we need to return the restaurant list basically
        title = json.loads(request.GET.get('title'))
        instance = filters.objects.get(title=title)
        restaurantDict = json.loads(instance.restaurantInfo)
        #print(restaurantDict)
        #print(restaurantDict[0])
        sortedDict = {}
        newDict = {}

        if(restaurantDict != 0):
            values = restaurantDict

            counter=0
            print("sorting alpha")
            for item in values:

                #print({0:values[0]})

                newDict.update({counter:values[str(counter)]})
                counter=counter+1
            #print(newDict)

            sortedDictIndexes = sorted(newDict, key=lambda k:newDict[k]['score'], reverse=True)
            counter1 = 0
            for index in sortedDictIndexes:
                sortedDict.update({counter1:newDict[index]})
                counter1 = counter1+1

        return HttpResponse(json.dumps({'sortedDict':json.dumps(sortedDict), 'sortedFilter':instance.filterInfo, 'serverFilterUsernamesUp': instance.filterUsernamesVotedUp, 'serverFilterUsernamesDown': instance.filterUsernamesVotedDown}), content_type='application/json')

    return render(request, 'blog/checkFilters.php', {'user': ''})



#This function is to change the server's file based on client's
def updateServerFilters(request):
    print("updating server filters")
    if request.is_ajax():
        #print(request.GET.get('filterChanged', ''))
        #print('is ajax')
        #now we need to change the database
        title = request.GET.get('title', '')
        filterChanged = request.GET.get('filterChanged', '')
        filterValue = request.GET.get('filterValue', '')

        #now we need to access and update the database
        profile = filters.objects.get(title=title)

        if(filterChanged == '0'):
            if(profile.filter1 == 'f'):
                profile.filter1 = 't'
            else:
                profile.filter1 = 'f'
        elif(filterChanged == '1'):
            if(profile.filter2 == 'f'):
                profile.filter2 = 't'
            else:
                profile.filter2 = 'f'
        elif(filterChanged == '2'):
            if(profile.filter3 == 'f'):
                profile.filter3 = 't'
            else:
                profile.filter3 = 'f'
        elif(filterChanged == '3'):
            if(profile.filter4 == 'f'):
                profile.filter4 = 't'
            else:
                profile.filter4 = 'f'
        elif(filterChanged == '4'):
            if(profile.filter5 == 'f'):
                profile.filter5 = 't'
            else:
                profile.filter5 = 'f'
        elif(filterChanged == '5'):
            if(profile.filter6 == 'f'):
                profile.filter6 = 't'
            else:
                profile.filter6 = 'f'
        elif(filterChanged == '6'):
            if(profile.filter7 == 'f'):
                profile.filter7 = 't'
            else:
                profile.filter7 = 'f'
        elif(filterChanged == '7'):
            if(profile.filter8 == 'f'):
                profile.filter8 = 't'
            else:
                profile.filter8 = 'f'
        profile.save()



    else:
        print('not ajax request')
    return render(request, 'blog/updateServerFilters.php')



#This function is for checking if the server's filters are diff from clients
def checkFilters(request):

    #Trying to use AJAX
    if request.is_ajax():
        username = request.GET.get('title', '')
        user = filters.objects.get(title=username)


        #json_response = {'user': {'title':user.title}}
        json_response = {'user': {'title':user.title, 'filter1':user.filter1, 'filter2':user.filter2, 'filter3':user.filter3, 'filter4':user.filter4, 'filter5':user.filter5, 'filter6':user.filter6, 'filter7':user.filter7, 'filter8':user.filter8}}
        return HttpResponse(json.dumps(json_response), content_type='application/json')
    return render(request, 'blog/checkFilters.php', {'user': ''})






def home(request):
    return render(request, 'blog/homepage.html', context3)




def about(request):
    return render(request, 'blog/about.html', {'title': 'About'})



def newGroup(request):
    #gen random string
    #gen new db entry w string as title
    #return string in json

    if request.is_ajax():

        print(" NEW AJAX REQUEST FOR GROUP")
        #gen random id
        unique_id = get_random_string(length=16)

        #create database entry with that id as title
        listFresh = list(Restaurant.objects.filter(region="UC").values())
        dictFresh = {}

        c = 0
        for item in listFresh:
            dictFresh.update({c:listFresh[c]})
            c=c+1



        newProfile = filters(title=unique_id, restaurantInfo=json.dumps(dictFresh), filterInfo=json.dumps(defaultFilters), filterUsernamesVotedUp=json.dumps(defaultUsernamesVoted), filterUsernamesVotedDown=json.dumps(defaultUsernamesVoted))
        print(newProfile.filterInfo)
        #print(newProfile.title)
        newProfile.save()

        json_response = {'urlString': {'url':unique_id}}
        return HttpResponse(json.dumps(json_response), content_type='application/json')
    return render(request, 'blog/newGroup.php', {'urlString': ''})

def groupPH(request):
    if request.is_ajax():
        print("here is the title:")
        print(request.GET.get('title', ''))
        title = request.GET.get('title', '')
        instance = filters.objects.get(title=title)

        #queryset = Restaurant.objects.filter(region="PH").values()
        return HttpResponse(json.dumps({'restaurantInfo':instance.restaurantInfo, 'filterInfo':instance.filterInfo, 'serverFilterUsernamesUp': instance.filterUsernamesVotedUp, 'serverFilterUsernamesDown':instance.filterUsernamesVotedDown}), content_type='application/json')

    return render(request, 'blog/home.html', contextPH)

def groupUC(request):
    if request.is_ajax():
        print("here is the title:")
        print(request.GET.get('title', ''))
        title = request.GET.get('title', '')
        instance = filters.objects.get(title=title)

        #queryset = Restaurant.objects.filter(region="PH").values()
        return HttpResponse(json.dumps({'restaurantInfo':instance.restaurantInfo, 'filterInfo':instance.filterInfo, 'serverFilterUsernamesUp': instance.filterUsernamesVotedUp, 'serverFilterUsernamesDown':instance.filterUsernamesVotedDown}), content_type='application/json')

    return render(request, 'blog/home.html', contextUC)

def groupEL(request):
    if request.is_ajax():
        queryset = Restaurant.objects.filter(region="EL").values()
        return HttpResponse(json.dumps({'posts': list(queryset)}), content_type='application/json')
    return render(request, 'blog/home.html', contextEL)

def alphaUpdateServerFilters(request):
    print("UPDATING SERVER FILTERS")
    title=request.GET.get('title')
    print(title)
    instance = filters.objects.get(title=title)
    newFilterInfo = request.GET.get('filterData', '')
    print(json.loads(newFilterInfo))
    #instance.filterInfo = #new filter info dumped as json

    instance.filterInfo = newFilterInfo;
    instance.save()

    return render(request, 'blog/home.html', contextEL)
