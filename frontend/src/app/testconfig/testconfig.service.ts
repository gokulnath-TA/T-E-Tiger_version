import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TestConfigService {
  constructor(private httpClient: HttpClient) {}

  GetAllMarkets() {
    return this.httpClient.get('Get_AllMarket').pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }

  GetStoresDetails(data:any)
  {
     return this.httpClient.post('Get_StoresDetails',{"data":data}).pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }
  Load_savedata() {
    return this.httpClient.get('Load_savedata').pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }

  EstimateTeststore (data:any)
  {
    return this.httpClient.post('Estimate_testStore',{"data":data}).pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  
  }
  UploadTestControlStores(formdata: FormData) {
    return this.httpClient.post('Upload_stores', formdata).pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }

  uploadfile(formdata: FormData) {
    return this.httpClient.post('GetMatch_teststore', formdata).pipe(
      map((body: any) => {
        if (body) {
          return body;
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }

  GetAllTestStore(data: any) {
    return this.httpClient.post('Get_AllTestStore', { data: data }).pipe(
      map((body: any) => {
        if (body) {
          if (body) {
            return body;
          } else {
            return {};
          }
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }

  SaveMeasurement(data:any){
    return this.httpClient.post('FromMeasurement', { data: data }).pipe(
      map((body: any) => {
        if (body) {
          if (body) {
            return body;
          } else {
            return {};
          }
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );

  }
  SaveStageOne(data: any) {
    return this.httpClient.post('Save_storedata', { data: data }).pipe(
      map((body: any) => {
        if (body) {
          if (body) {
            return body;
          } else {
            return {};
          }
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }

  Checktestname(data: any) {
    return this.httpClient
      .post('Check_testname', {
        test_name: data.test_name,
        market_id: data.market_id
      })
      .pipe(
        map((body: any) => {
          if (body) {
            if (body) {
              return body;
            } else {
              return {};
            }
          } else {
            return {};
          }
        }),
        catchError(() => of([]))
      );
  }

  DeleteSavedData(data: any) {
    return this.httpClient.delete('Delete_savedata/' + data).pipe(
      map((body: any) => {
        if (body) {
          if (body) {
            return body;
          } else {
            return {};
          }
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }

  LoadSavedTest(data: any) {
    return this.httpClient.post('GetAllSavedData', {"data":data}).pipe(
      map((body: any) => {
        if (body) {
          if (body) {
            return body;
          } else {
            return {};
          }
        } else {
          return {};
        }
      }),
      catchError(() => of([]))
    );
  }


}
