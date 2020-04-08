import os 
import pdb
import time

import configparser
import pandas as pd
import paramiko as pk

from helpers import mkdir,chmod
from helpers import config,storeKeys

from engine import analysehelper

# config = configparser.ConfigParser()
# config.read('config.ini')

def getConnet():
    """
        params:
        ------

        returns:
        -------
            sftp       :    sftp connection object          -   paramiko.sftp_client.SFTPClient

        dependencies:
        -------
    """
    key = pk.RSAKey.from_private_key_file(config['pathConfig']['keyPath'])
    t = pk.Transport(config['sshCreds']['host'], 22)
    t.connect(None, config['sshCreds']['userName'], None, key)
    return pk.SFTPClient.from_transport(t)

def readData(sftp):
    """
        params:
        ------
            sftp       :    sftp object from  getConnect()      -   paramiko.sftp_client.SFTPClient

        returns:
        -------

        dependencies:
        -------
    """
    logdf = pd.DataFrame(columns=['file','time','error'])
    mkdir(config['pathConfig']['logPath'])
    logFile = os.path.join(config['pathConfig']['logPath'],'readData.csv')
    weeklyFiles = config['fileConfig']['weeklyFiles'].split(',')
    weeklyFiles = [weeklyFile.strip(' ') for weeklyFile in weeklyFiles]
    for weeklyFile in weeklyFiles:
        st = time.time()
        try:
            weekData = pd.read_sas(sftp.open(os.path.join(config['pathConfig']['sasPath'],weeklyFile)),format='sas7bdat')
            fileName = os.path.join(config['pathConfig']['dataPath'],weeklyFile.split('.')[0]+'_test.csv')
            weekData.to_csv(fileName)
            chmod(fileName)
            logdf.loc[len(logdf)] = [weeklyFile,round(time.time()-st,2),None]
        except Exception as e :
            logdf.loc[len(logdf)] = [weeklyFile,round(time.time()-st,2),e]
            pass
        if os.path.exists(logFile):
            logdf.to_csv(logFile,mode='a',header=False)
        else:
            logdf.to_csv(logFile)
            chmod(logFile)

    return

if __name__ == '__main__':
    sftp = getConnet()
    readData(sftp)
    sftp.close()

# if config['runConfig']['storeID'] in sasdata.columns:
# 	storeCol = config['runConfig']['storeID']
# else:
# 	storeCol = config['runConfig']['storeID']
# 	storeCols = ['store_sk','store_bbk']
# 	storeMap = pd.read_sas(sftp.open(os.path.join(config['sshCreds']['sasPath'],config['fileConfig']['storeMap'])),format='sas7bdat')
# 	storeMap = storeMap.loc[storeMap[storeCol].isin(stores)][storeCols]
# 	storeCol = [col for col in storeCols if col != storeCol][0]
