from django.shortcuts import render, redirect
from django.http import HttpResponse

def home(request):
    if (request.method == "POST"):
        return redirect("main/")
    return render(request, 'dreams/home.html')

def main(request):
    return render(request, 'dreams/main.html')

def table(request):
    return render(request, 'dreams/table.html')
