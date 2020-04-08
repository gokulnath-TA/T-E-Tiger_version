import re
import os
import pdb
import sys
import scipy
import configparser
import pandas as pd
import numpy as np

from functools import reduce
from datetime import datetime, timedelta

config = configparser.ConfigParser()
config.read('config.ini')
storeKeys = ['storeID']
itemKey = 'itemDes'



def configSplit(attribute):
    arr = attribute.split(',')
    return [col.strip(' ') for col in arr]

trendCols = configSplit(config['runConfig']['trendCols'])
constrainCols = configSplit(config['runConfig']['constrainCols'])
analyseFeatureCols = configSplit(config['logConfig']['analyseFeatureCols'])
identifyControlCols = configSplit(config['logConfig']['identifyControlCols'])
liftAnalysisCols = configSplit(config['logConfig']['liftAnalysisCols'])
logIndex = config['logConfig']['logIndexCol']

storeChar = None
try:
    storeChar = pd.read_csv(os.path.join(config['pathConfig']['dataPath'],config['fileConfig']['storeChar']))
    storeChar[storeKeys] = storeChar[storeKeys].astype('str')
    storeChar = storeChar.set_index(storeKeys)
except FileNotFoundError:
    sys.exit()

def init():
    trialPath = config['pathConfig']['trialPath']
    logPath = config['pathConfig']['logPath']
    if not os.path.exists(trialPath):
        mkdir(trialPath)
    if os.path.exists(os.path.join(logPath,config['fileConfig']['logFile'])):
        df = pd.read_csv(os.path.join(logPath,config['fileConfig']['logFile']))
        if (len(df.columns) != len([logIndex]+analyseFeatureCols+identifyControlCols+liftAnalysisCols)):
            logBackup = os.path.join(logPath, config['fileConfig']['logFile'].split('.')[0]+'_'+datetime.today().strftime('%Y%m%d')+'.csv')
            df.to_csv(logBackup,index=False)
            chmod(logBackup)
            os.remove(os.path.join(logPath,config['fileConfig']['logFile']))
    elif not os.path.exists(logPath):
        mkdir(logPath)
    return

def logs(action,logdf=None,trial=None):
    """
        params:
            action          :   to save or to read log file                                     -   str
            trial           :   trial id is passed as a parameter to read logs of given trial   -   str
            logdf           :   logdf is passed as a parameter to save logs of given trial      -   pandas DataFrame
            
        returns:
            logdf           :   logs of given trial                                             -   pandas DataFrame
            
        dependencies:
            logs.csv        :   file containing logs of all trials                              -   .csv file
                                located at the path mentioned in config.ini as ['logPath']
            mkdir()         :   user defined function in helper.py
            chmod()         :   user defined function in helper.py
    """
    logFile = os.path.join(config['pathConfig']['logPath'],config['fileConfig']['logFile'])
    if action == "save":            
        if os.path.exists(logFile):
            logtempdf = pd.read_csv(logFile)
            logtempdf = logtempdf[~logtempdf.trial.isin(logdf.index.values)]
            logtempdf = logtempdf.append(logdf.reset_index())
            logtempdf.to_csv(logFile,index= False)
        else:
            logdf = logdf.reset_index()
            logdf.to_csv(logFile,index= False)
            chmod(logFile)
        return
    
    if action == "read":
        if os.path.exists(logFile):
            logdf = pd.read_csv(logFile)
            logdf[logIndex] = logdf[logIndex].astype('str')
            try:
                logdf = logdf.loc[logdf[logIndex] == trial]
            except KeyError:
                logdf.loc[len(logdf),logIndex] = trial
        else :        
            logdf = pd.DataFrame(columns=[logIndex] + analyseFeatureCols + identifyControlCols + liftAnalysisCols)
            logdf.loc[len(logdf),logIndex] = trial 

        logdf = logdf.set_index([logIndex])
        logdf[logdf.columns] = logdf[logdf.columns].astype(object)
        return logdf
  
def filterColumns(dataStore,testStores,logdf):
    '''
        Summary:
            1.  Has to be applied at Store level data
            2.  Removes columns that have more than (>) 50% of missing values
            3.  Numerical columns - missing values are replaced with either mean, median or
                random number between min- max
            4.  Categorical columns - missing values are replaced with the most frequently
                occuring value in the column
            5.  Datetime columns - not treated in this function
        Parameters:
            dataStore   : DataFrame, at store level
            testStores  : list of testStores
        Returns:
            Dataframe  , with store level data with missing values imputed        
    '''
    df_combined = None
    catFeatures = []
    numFeatures = []
    try:
        catCols = dataStore.select_dtypes(object).columns.tolist()
        if len(catCols) > 0:
            cat_cols_nlevels = dataStore[catCols].nunique().reset_index().rename(columns= {'index':'catColumns',0:'nlevels'})
            catCols = cat_cols_nlevels[(cat_cols_nlevels['nlevels']>len(testStores)) | (cat_cols_nlevels['nlevels'] <= 1)].catColumns.tolist()
            catFeatures = cat_cols_nlevels.catColumns.tolist()
            catFeatures = list(set(catFeatures) - set(catCols))
        
            
        numCols = dataStore.select_dtypes([np.datetime64, np.number]).columns.tolist()
        if len(numCols) > 0:
            other_cols_nlevels = dataStore[numCols].nunique().reset_index().rename(columns= {'index':'otherColumns',0:'nlevels'})
            numCols = other_cols_nlevels[(other_cols_nlevels['nlevels'] <= 1)].otherColumns.tolist()
            numFeatures = other_cols_nlevels.otherColumns.tolist()
            numFeatures = list(set(numFeatures) - set(catCols))

        dataStore = dataStore.drop(columns= numCols + catCols)
        
        # based on missing data at store level - remove features that have more than 50% missing data
        df_filtered = dataStore.dropna(thresh = int(len(dataStore))*0.5,axis= 1)

        # columns that can be considered for segregating to numerical and categorical - removing the bad columns
        # imputing the remaining columns - with mean, median, or random number between min-max
        # storing numerical and categorical columns in separate lists
        all_cols = df_filtered.columns
        num_cols = list(df_filtered[all_cols].select_dtypes([np.number]).columns)

        num_cols_array = np.array(df_filtered[num_cols])
    
        # treating numeric columns
        if(config['runConfig']['IMPUTATION_METHOD'] == 'mean'):
            num_cols_miss = np.nanmean(num_cols_array, axis= 0)
        elif(config['runConfig']['IMPUTATION_METHOD'] == 'median'):
            num_cols_miss = np.nanmedian(num_cols_array, axis= 0)
        elif(config['runConfig']['IMPUTATION_METHOD'] == 'random'):
            num_cols_miss = np.array([np.random.choice(df_filtered[df_filtered[j] != np.nan][j]) for j in num_cols])
            # finding the indices that need to be replaced
        num_inds = np.where(pd.isnull(num_cols_array))
            # replace the nans with the above replacements, align using np.take
        num_cols_array[num_inds] = np.take(num_cols_miss,num_inds[1])
            # creating back a dataframe
        num_cols_df = pd.DataFrame(num_cols_array,index= dataStore.index,columns= num_cols)
        num = True
        if len(num_cols_df.columns) == 0:
            num = False
        num_cols_df = num_cols_df.reset_index()

        # treating categoric columns
        cat_cols = df_filtered[all_cols].select_dtypes([object]).columns
            # converting to array
        cat_cols_array = np.array(df_filtered[cat_cols])
            # finding the most frequent value in each column
        cat_cols_miss = np.array([df_filtered[j].value_counts().index[0] for j in cat_cols])
            # finding the indices that need to be replaced
        cat_inds = np.where(pd.isnull(cat_cols_array))
            # replacing the indices with the most frequent value
        cat_cols_array[cat_inds] = np.take(cat_cols_miss,cat_inds[1])
            # creating back a dataframe
        cat_cols_df = pd.DataFrame(cat_cols_array,index= dataStore.index,columns= cat_cols)
        cat = True
        if len(cat_cols_df.columns) == 0:
            cat = False
        cat_cols_df = cat_cols_df.reset_index()
    
        # combining the numerical and cateogrical arrays and appending the key cols back
        if cat and num:
            df_combined = pd.merge(num_cols_df,cat_cols_df,on= storeKeys)
            df_combined = df_combined.set_index(storeKeys)
        elif cat:
            df_combined = cat_cols_df.copy()
        elif num:
            df_combined = num_cols_df.copy()

    except Exception as e:
        _,_, exc_tb = sys.exc_info()
        error =[exc_tb.tb_lineno,os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]]
        trial = logdf.index.values[0]
        logdf.loc[trial,analyseFeatureCols[-2:]] = [e,error]
        logs("save",logdf = logdf.copy())
        pass
    return df_combined, numFeatures, catFeatures, logdf

def getFeatures(trial,testStores,dataStore,metric,hierarchy,itemList, logdf,extraFeatures=None):
    """
        params:
            trial           :   trial id unique for a chosen test                               -   str
            testStores      :   ids test stores selected                                        -   list of strings
            dataStore       :   store x week data filtered for the chosen interval              -   pandas DataFrame
            metric          :   metric chosen for test. 1 - Wt. avg price,
                                                        2 - % Sales                             -   int 
            hierarchy       :   hierarchy level selected. dict containing following keys.       -   python dict

                                        'lvl'       : 1 for Level 1,                -   str
                                                      2 for Level 2,
                                                      3 for Level 3,
                                                      4 for Level 4
                                        'catgories' :  list of categories selected. -   list of strings
                                                      (names as per the file provided)

            itemList        :   ids of items selected                                           
        
        returns:
            modelData       :   storeCharecteristics, demographics, one-hot encoded columns,       - pandas DataFrame
                                hierarchyLevel features (if any), trends and ALL AT STORE LEVEL
            target          :   storeLevel Target variable                                         - pandas DataFrame
            modelData.csv   :   csv containing all the features for modelling for all stores       - .csv file will be saved at ['dataPath']
            trialSales.csv  :   csv containing weekly sales for all stores for selected interval   - .csv file will be saved at ['dataPath']
        
        dependencies:
            storeChar.csv   :   file containing storeCharacteristics and demographics       -   .csv file
                                located at the path mentioned in config.ini as ['dataPath']
            itemMap.csv     :   file containing item categories and items mapping           -   .csv file
                                located at the path mentioned in config.ini as ['dataPath']

            mkdir()         :   user defined function in helper.py
            chmod()         :   user defined function in helper.py
    """
    global storeChar
    modelData = None
    target = None
    extraFlag = None
    numFeatures = None
    catFeatures = None
    removeStores = None
    try:
        try:
            itemMap = pd.read_csv(os.path.join(config['pathConfig']['dataPath'],config['fileConfig']['itemMap']))
            itemMap[itemKey] = itemMap[itemKey].astype('str')
        except FileNotFoundError:
            sys.exit()
        logdf.loc[trial,'numProducts'] = len(itemList)
        selectedItems = [col for col in dataStore.columns if col.split('net_')[-1] in itemList]
        logdf.loc[trial,'numProductSelected'] = len(selectedItems)

        # save weeklySales data for all stores to plot the sales
        mkdir(os.path.join(config['pathConfig']['trialPath'],trial))
        fileName = os.path.join(config['pathConfig']['trialPath'],trial,config['fileConfig']['trialSales'])
        dataStore.loc[:,['TotNet']].to_csv(fileName)
        chmod(fileName)
        
        # calculating trend variable
        dataStore['dvSalesSum'] = dataStore[selectedItems].sum(axis= 1)

        # drop selectedItems
        dataStore = dataStore.drop(columns= selectedItems)
        itemCols = [col for col in dataStore.columns if col.startswith('net_')]

        # trend calculation
        dfTrendCalc = dataStore[trendCols]
        dfTrendCalc = dfTrendCalc.reset_index()
        endDate = pd.to_datetime(dataStore.reset_index(level=1)['wkEndDate']).max()
        dfRecency = dfTrendCalc[dfTrendCalc.wkEndDate > (endDate - timedelta(weeks =8))]
        dfRecency['label'] = np.where(dfRecency['wkEndDate'] > (endDate - timedelta(weeks=4)), 'ultimate','penultimate')
        dfRecency = dfRecency.pivot_table(index = storeKeys, columns = 'label', values= 'wkEndDate', aggfunc = lambda x: len(x.unique()))
        dfRecency = dfRecency.replace(np.nan,0)
        # stores that can be removed because of insufficient recent data
        removeStores = dfRecency[dfRecency['penultimate']<1].index.values.tolist() + dfRecency[dfRecency['ultimate']<1].index.values.tolist() + list(set(dfTrendCalc[storeKeys[0]].unique()) - set(dfRecency.index.unique()))
        removeStores = removeStores + [store for store in testStores if store not in dataStore.index.levels[0]]

        dfTrendCalc['WeekNumber'] = dfTrendCalc.groupby(storeKeys)['wkEndDate'].cumcount(ascending= False)+1
        dfTrendCalc = dfTrendCalc.reset_index()
    
        dfTrend = dfTrendCalc.groupby(storeKeys).apply(lambda x: ((x[trendCols][::-1][:4].mean())/(x[trendCols][::-1][4:8].mean())-1)).reset_index()
        # rename the trend columns to end with trend
        dfTrend.columns = [colname + '_trend' if colname in trendCols else colname for colname in dfTrend.columns]

        # aggregating to a store level
        dataStore = dataStore.groupby(by= storeKeys).mean()
        dataStore[itemCols] = np.where(dataStore[itemCols].div(dataStore['TotNet'],axis= 0)<0.01,np.nan,dataStore[itemCols])
        
        target = pd.DataFrame(index= dataStore.index)
        if int(metric) == 1: #weighted price 
            target['target'] = dataStore['dvSalesSum'].div(dataStore['unit_count_adj'],axis= 0)
        elif int(metric) == 2: #per sales
            target['target'] = dataStore['dvSalesSum'].div(dataStore['TotNet'],axis= 0)
        dataStore = dataStore.drop(columns= ['dvSalesSum'])

        # Aggregating features step : identifying the product categories the products belong to in the seleceted hierarchy
        otherCategories = itemMap.loc[~itemMap['hierarchy'+hierarchy['lvl']].isin(hierarchy['categories']),'hierarchy'+hierarchy['lvl']].unique()
        
        # aggregating for included items to their respective category level sums        
        otherCategoryFeatures = {"category_net_"+category: itemMap.loc[itemMap['hierarchy'+hierarchy['lvl']]==category,itemKey].unique() for category in otherCategories} 

        for feature, otherItems in otherCategoryFeatures.items():
            otherItems = ['net_'+item for item in otherItems]
            otherItems = [otherItem for otherItem in otherItems if otherItem in itemCols]
            try:
                dataStore[feature] = dataStore[otherItems].sum(axis= 1)
            except:
                pass

        badCols = configSplit(config['runConfig']['badCols'])
        storechar = storeChar.drop(columns= badCols + constrainCols).reset_index()
        dateCols = [col for col in storechar.columns if '_date' in col]
        if len(dateCols)>0:
            storechar[dateCols] = (datetime.today() - storechar[dateCols].apply(pd.to_datetime,format='%m/%d/%Y')).astype('timedelta64[W]')
            storechar[dateCols] = storechar[dateCols].mask(storechar[dateCols]<0,0)
        
        # merging trend table to the store level idv features
        dataStore = reduce(lambda df1,df2 : pd.merge(df1,df2,on= storeKeys),[storechar, dataStore, dfTrend])
        extraFlag = None
        if extraFeatures is not None:
            extraFeatures[storeKeys] = extraFeatures[storeKeys].astype('str')
            extraFeatures = extraFeatures.set_index(storeKeys)
            extraFlag = pd.DataFrame(columns = ['extraFeatures','comments'])
            extraFlag['extraFeatures'] = extraFeatures.columns 
            # appending with the datastore
            dataStore = reduce(lambda df1,df2 : pd.merge(df1,df2,on= storeKeys, how='outer',suffixes=("","_dataStore")),[extraFeatures, dataStore])
            # applying filterColumns
            dataStore, numFeatures, catFeatures, logdf = filterColumns(dataStore.set_index(storeKeys), testStores, logdf.copy())
            if dataStore is None:
                return modelData, target, extraFlag, numFeatures, catFeatures, logdf.copy(), removeStores 
            extraFlag.loc[extraFlag['comments'].isna(),'comments'] = np.where(extraFlag[extraFlag['comments'].isna()].extraFeatures.isin(dataStore.columns),None,config['logConfig']['dataInsufficient'])
            # checking multi-collinearity among extra features within and with the existing dataStore - threshold is 95%
            if len(extraFlag.loc[extraFlag.comments.isna()]) > 0:
                corr = dataStore.corr().abs()
                extraCols = extraFlag.loc[extraFlag.comments.isna(),'extraFeatures'].values
                # extracting the extra feature columns
                corr = corr[[col for col in extraCols]]
                corr = corr[corr>=0.95]
                # 1. checking within the extra columns
                corrWithin = corr[corr.index.isin(extraCols)]
                corrWithin = corrWithin.where(np.triu(np.ones(corrWithin.shape), k=1).astype(bool))
                removeColumns = corrWithin.dropna(axis=1, how='all').columns.values.tolist()
                # 2. checking with the existing dataStore columns
                corr = corr[[col for col in corr.columns if col not in removeColumns]]
                corrExisting = corr[~corr.index.isin(extraCols)]
                removeColumns = removeColumns + corrExisting.dropna(axis=1, how='all').columns.values.tolist()        
                dataStore = dataStore.drop(columns= removeColumns)
                extraFlag.loc[extraFlag['comments'].isna(),'comments'] = np.where(extraFlag[extraFlag['comments'].isna()].extraFeatures.isin(dataStore.columns),None,config['logConfig']['multiCorr'])
        else:
            dataStore, numFeatures, catFeatures, logdf = filterColumns(dataStore.set_index(storeKeys),testStores, logdf.copy())
            if dataStore is None:
                return modelData, target, extraFlag, numFeatures, catFeatures, logdf.copy(), removeStores

        dataStore = dataStore[~dataStore.index.isin(removeStores)]
        # test collinearity with the target variable - threshold is 70%
        dataStore = reduce(lambda df1,df2 : pd.merge(df1,df2,on= storeKeys),[dataStore, target])
        try:
            dataStore = dataStore.set_index(storeKeys)
        except KeyError:
            pass
        corr = dataStore.corr()
        # separating the cat cols
        cat_cols = dataStore.select_dtypes(object).columns
        dataStore = dataStore[corr[corr['target']<0.75].index.values.tolist() + cat_cols.tolist()]

        # filter columns that have 50% or more missing values, have singular values and impute the missing values - in IDV table
        
        dataStore = pd.get_dummies(dataStore)
        
        testStores = [store for store in testStores if store not in removeStores] 
        
        if(config['runConfig']['WINSORIZE_METHOD'] == 'mstats'):
            dataStore = pd.DataFrame(scipy.stats.mstats.winsorize(dataStore,limits= 0.01),index= dataStore.index,columns= dataStore.columns)
        elif(config['runConfig']['WINSORIZE_METHOD'] == 'clip'):
            dataStore = dataStore.clip(lower = dataStore.quantile(0.01), upper = dataStore.quantile(0.99), axis=1)

        # saveData for using in identifyControls
        fileName = os.path.join(config['pathConfig']['trialPath'],trial,config['fileConfig']['modelData'])
        dataStore.to_csv(fileName)
        chmod(fileName)
        # # merge the aggregated and onehot df

        # filter test Stores
        modelData = dataStore.loc[testStores]
        target = target.loc[testStores]

        if extraFlag is not None:
            extraFlag.loc[extraFlag['comments'].isna(),'comments'] = np.where(extraFlag[extraFlag['comments'].isna()].extraFeatures.isin(dataStore.columns),None,config['logConfig']['corr'])
            dupCols = None
            if len([col for col in dataStore.columns if '_dataStore' in col]) > 0:
                dupCols = [col for col in dataStore.columns if '_dataStore' in col]
            logdf.loc[trial,['extraFeatureShape', 'extraFeatureFiltered', 'dataInsufficient', 'multiCorr', 'corr', 'extraDuplicateCols', 'modelData.shape']] = [[[extraFeatures.shape[0]],[extraFeatures.shape[1]]], len(extraFlag.loc[extraFlag.comments.isna()]), len(extraFlag.loc[extraFlag.comments == config['logConfig']['dataInsufficient']]), len(extraFlag.loc[extraFlag.comments == config['logConfig']['multiCorr']]), len(extraFlag.loc[extraFlag.comments == config['logConfig']['corr']]), [[col] for col in dupCols],[[modelData.shape[0]], [modelData.shape[1]]]]
            
            extraFlag.loc[extraFlag['comments'].isna(),'comments'] = config['logConfig']['considered']
        else:
            logdf.loc[trial,['extraFeatureShape', 'extraFeatureFiltered', 'dataInsufficient', 'multiCorr', 'corr', 'extraDuplicateCols', 'modelData.shape']] = [None, None, None, None, None, None, [modelData.shape[0], modelData.shape[1]]]
        
    except Exception as e:
        _,_, exc_tb = sys.exc_info()
        error =[exc_tb.tb_lineno,os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]]
        logdf.loc[trial,analyseFeatureCols[-2:]] = [e,error]
        logs("save",logdf = logdf.copy())
        pass

    return modelData, target, extraFlag, numFeatures, catFeatures, logdf.copy(), removeStores

def chmod(fileName):
    """
        params:
            fileName       :    path for which the user permission has to be changed        -   string

        returns:

        dependencies:
    """
    try:
        os.chmod(fileName,0o0777)
        return
    except:
        return

def mkdir(path):
    """
        params:
            fileName       :    path of the directory which has to created                  -   string

        returns:

        dependencies:
    """
    if not os.path.exists(path):
        os.makedirs(path)
        chmod(path)
    return
