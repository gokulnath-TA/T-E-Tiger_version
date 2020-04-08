# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
# from rest_framework.pagination.PageNumberPagination import PageNumberPagination
from . import models
# from django.contrib.auth.models import User
from django.core.serializers import *
from . import json
from rest_framework import serializers
from rest_framework.validators import *
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.pagination import PageNumberPagination



class GetAllMarketSerializer(serializers.ModelSerializer):

	class Meta:
		model = models.MarketMstr
		fields = '__all__'
		

class GetAllStoreSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.StoreMstr
		fields = '__all__'


class MatchTestStoreSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.StoreMstr
		fields = ('store_id','store_name','store_sk','state_long','store_type')	
		

class GetLeveloneSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.ProductMstr
		fields = ('pro_id','levelone_cate')

class GetLeveltwoSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.ProductMstr
		fields = ('pro_id','leveltwo_cate')

class GetLevelthreeSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.ProductMstr
		fields = ('pro_id','levelthree_cate')

class GetLevelfourSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.ProductMstr
		fields = ('pro_id','levelfour_cate')


class GetproductSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.ProductMstr
		fields = ('pro_id','menu_item_bk','menu_item_desc')



class GetAllFeaturesSerializer(serializers.ModelSerializer):
	
	feature_list = serializers.SerializerMethodField('Get_all_feature_list')

	def Get_all_feature_list(self,data):
		print(data.feat_id)
		try:
			data = models.FeatureTbl.objects.filter(feat_id=data.feat_id)
			data = GetAllFeaturesListSerializer(data,many=True)
		except:
			return "Features is not found"
		
		return data.data


	class Meta:
		model = models.FeatureMstr
		fields = ('feat_id','feat_name','market_id','feature_list')


class GetAllFeaturesListSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.FeatureTbl
		fields = ('feats_id','feat_id','feature_name')



class LoadDataSeralizer(serializers.ModelSerializer):
	
	market = serializers.SerializerMethodField('Get_Market_details')

	def Get_Market_details(self,data):
		try:
			data = models.MarketMstr.objects.get(market_id=data.market_id.pk)
		except:
			return "Market is not found"
		data = GetAllMarketSerializer(data)
		return data.data

	class Meta:
		model = models.TestMstr
		fields = ('test_id','test_name','market','stage_id','created_on','modified_on')


class GetRecordSerializer(serializers.ModelSerializer):

	class Meta:
		model = models.RecordMstr
		fields = '__all__'

class gettestStoreSerializer(serializers.ModelSerializer):

	market = serializers.SerializerMethodField('Get_Market_details')

	def Get_Market_details(self,data):
		try:
			data = models.MarketMstr.objects.get(market_id=data.market_id.pk)
		except:
			return "Market is not found"
		data = GetAllMarketSerializer(data)
		return data.data

	records = serializers.SerializerMethodField('Get_Record')

	def Get_Record(self,data):
		try:
			data = models.RecordMstr.objects.filter(test_id=data.pk)
		except:
			return "Record is not found"
		data = GetRecordSerializer(data,many=True)
		return data.data


	class Meta:
		model = models.TestMstr
		fields = ('test_id','test_name','market', 'records','stage_id','created_on','modified_on')

