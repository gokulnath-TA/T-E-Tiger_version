from django.urls import include, path
from . import teststore
from . import views
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )


urlpatterns = [

	#   path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
	#   path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
	#   Authorization and authentication mgmnt
	#   path('login',views.login),

	 path('Get_AllMarket' , views.Markets.as_view()),
	 path('Get_AllTestStore',teststore.TestStore.as_view()),
	 path('Get_category',teststore.Get_category),
	 path('Get_Daterange',teststore.dateRange),
	 path('Get_weeks',teststore.Weekduration),
	 path('Get_products',teststore.Get_products),
	 path('Check_testname', teststore.Checkname),
	 path('Upload_teststore', teststore.UploadTestStore),	 
	 path('Upload_stores', teststore.UploadTestControlStore),
	 path('Upload_Items',teststore.UploadItemMapping),
	 path('Upload_features',teststore.UploadFeatures),
	 path('Getall_features', teststore.Getall_features),
	 path('GetMatch_teststore', teststore.GetMatchingTestStore),
	 path('Exclude_controlstore', teststore.ExcludeControlStore), 
	 path('Save_storedata', teststore.SaveStage),
	 path('Update_storedata', teststore.UpdateStage),
	 path('download_report/<int:pk>' ,teststore.Downloadreport.as_view()),
	 path('Load_savedata', teststore.LoadSaveData),
	 path('Delete_savedata/<int:pk>', teststore.Edit_TestStore.as_view()),
	 path('Load_savetest/<int:pk>', teststore.Edit_TestStore.as_view()), 
	 path('GetAllSavedData', teststore.GetAllSavedData), 
	 path('Get_StoresDetails', teststore.Get_StoresDetails), 
	 path('FromMeasurement', teststore.FromMeasurement),  
	 path('Check_addiFeature', teststore.Check_additionalFeature),
	 path('analyze_feature',teststore.analyseFeatures),
	 path('Identify_ctrlstore',teststore.identifyControls),
	 path('Test_analyzefeature',teststore.liftAnalysis),
	 path('Estimate_testStore', teststore.sampleSize)

 
   ]
