from django.db import models
import time
# from django.contrib.auth.models import User
from django.conf import settings
from datetime import datetime    

# Create your models here.

class BaseModel(models.Model):
   created_on = models.IntegerField(null=True, blank=True)
   modified_on = models.IntegerField(null=True, blank=True)
   is_active = models.BooleanField(default=True)
   deleted_at = models.IntegerField(blank=True, null=True)
   is_deleted = models.BooleanField(default=False)   
   
   class Meta:
       abstract = True


class MarketMstr(BaseModel):
    market_id = models.AutoField(primary_key=True) 
    market_name = models.CharField(max_length=250)
    
    class Meta:
        managed = True
        db_table = 'Te_MarketMstr'

class TestMstr(BaseModel):
    test_id = models.AutoField(primary_key=True) 
    test_name = models.CharField(max_length=250)
    market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
    stage_id = models.IntegerField(blank=True,null=True) 

    class Meta:
        managed = True
        db_table = 'Te_TestMstr'

class StoreMstr(BaseModel):
    store_id = models.AutoField(primary_key=True) 
    store_name = models.CharField(max_length=250)
    market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
    store_sk  = models.IntegerField(blank=True,null=True) 
    store_name_short     = models.TextField(blank=True,null=True)
    state_short = models.TextField(blank=True,null=True)
    state_long  = models.TextField(blank=True,null=True)
    store_type = models.TextField(blank=True,null=True)
    locality_description    = models.CharField(max_length=250,blank=True,null=True)   


    class Meta:
        managed = True
        db_table = 'Te_StoreMstr'


class TestStoreTbl(BaseModel):
    tstore_id = models.AutoField(primary_key=True) 
    test_id = models.ForeignKey(TestMstr,on_delete=models.PROTECT,null=True)
    store_id = models.ForeignKey(StoreMstr,on_delete=models.PROTECT,null=True)
    
    class Meta:
        managed = True
        db_table = 'Te_TeststoreTbl'



class TargetMetricMstr(BaseModel):
    tarmet_id = models.AutoField(primary_key=True) 
    tarmet_name = models.CharField(max_length=250)
    market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
   
    class Meta:
        managed = True
        db_table = 'Te_TarMetMstr'


class HierachyMstr(BaseModel):
    hier_id = models.AutoField(primary_key=True) 
    hier_name = models.CharField(max_length=250)
    market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
   
    class Meta:
        managed = True
        db_table = 'Te_HierachyMstr'

# class CategoryMstr(BaseModel):
#     cate_id = models.AutoField(primary_key=True) 
#     cate_name = models.CharField(max_length=250)
#     market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
#     hier_id   = models.ForeignKey(HierachyMstr,on_delete=models.PROTECT,null=True)

#     class Meta:
#         managed = True
#         db_table = 'Te_CategoryMstr'

class ProductMstr(BaseModel):
    pro_id = models.AutoField(primary_key=True) 
    menu_item_bk = models.IntegerField(blank=False,null=False   ) 
    menu_item_desc = models.CharField(max_length=250)
    market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
    size_code = models.TextField(blank=True,null=True)
    levelone_cate = models.TextField(blank=True,null=True)
    leveltwo_cate = models.TextField(blank=True,null=True)
    levelthree_cate = models.TextField(blank=True,null=True)
    levelfour_cate = models.TextField(blank=True,null=True)
    
    # cate_id   = models.ForeignKey(CategoryMstr,on_delete=models.PROTECT,null=True)
      
    class Meta:
        managed = True
        db_table = 'Te_ProductMstr'


class FeatureMstr(BaseModel):
    feat_id = models.AutoField(primary_key=True) 
    feat_name = models.CharField(max_length=250)
    market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
        
    class Meta:
        managed = True
        db_table = 'Te_FeatureMstr'


class FeatureTbl(BaseModel):
    feats_id = models.AutoField(primary_key=True) 
    feat_id = models.ForeignKey(FeatureMstr,on_delete=models.PROTECT,null=True)
    feature_name = models.CharField(max_length=250)

    class Meta:
        managed = True
        db_table = 'Te_FeaturesTbl'


class RecordMstr(BaseModel):
    record_id = models.AutoField(primary_key=True) 
    test_id = models.CharField(max_length=250)
    market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
    stage_id = models.IntegerField(blank = True ,null=True)
    stepper_id = models.IntegerField(blank = True,null=True)
    record_value = models.CharField(max_length =250) # longtext need to come here

        
    class Meta:
        managed = True
        db_table = 'Te_RecordMstr'

class MesuremetricMstr(BaseModel):
    mesur_id = models.AutoField(primary_key=True) 
    mesur_name = models.CharField(max_length=250)
    market_id = models.ForeignKey(MarketMstr,on_delete=models.PROTECT,null=True)
            
    class Meta:
        managed = True
        db_table = 'Te_MesuremetricMstr'



