from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.shortcuts import get_object_or_404, render, redirect
from django.template.defaulttags import register
from django.template import loader
from django.urls import reverse
import pandas as pd
import numpy as np
import pickle
import json
import os

def home(request):
    if (request.method == "POST"):
        return redirect("main/")
    return render(request, 'dreams/home.html')

def main(request):
    return render(request, 'dreams/main.html')

def second(request):
    return render(request, 'dreams/second.html')
