from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from .models import *
# from django.contrib.auth.hashers import make_password
from . import json
from django.utils.crypto import get_random_string
from . import helpers
from django.core.exceptions import ObjectDoesNotExist
import smtplib
from email.mime.text import MIMEText
from rest_framework.response import Response
from rest_framework import generics
from django.core import serializers
from django.db import transaction
from django.conf.urls import url
from rest_framework_swagger.views import get_swagger_view
from django.views.generic import ListView
import pandas as pd
import os

schema_view = get_swagger_view(title='Pastebin API')

urlpatterns = [
    url(r'^$', schema_view)
]

# Create your views here.


class Markets(ListView):
	def get(self,serializer):
		# try:
		get_marketdata = MarketMstr.objects.filter(is_active=True,is_deleted=False)
		market_data = GetAllMarketSerializer(get_marketdata,many=True)
		
		return json.Response(market_data.data,True)


