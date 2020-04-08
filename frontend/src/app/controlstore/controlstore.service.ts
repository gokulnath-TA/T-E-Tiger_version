import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ControlStoreService {
  constructor(private httpClient: HttpClient) {}

  GetHierachy() {
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
  
  GetProductCat(data: any) {
    return this.httpClient.post('Get_category', data).pipe(
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

  GetProducts(data: any) {
    return this.httpClient.post('Get_products', data).pipe(
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

  GetConsideredFeatures(data: any) {
    return this.httpClient.post('Getall_features', data).pipe(
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

  GetWeeks(data:any)
  {    
     return this.httpClient.post('Get_weeks',data).pipe(
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

  GetDateRange()
  {
    return this.httpClient.get('Get_Daterange').pipe(
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
  AnalyzeFeatures(data: any) {
    return this.httpClient.post('analyze_feature', { data: data }).pipe(
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

  
  SaveStageTwo(data: any,stringified_data:any) {
    return this.httpClient.post('Update_storedata',{data:data,stringified_data:stringified_data}).pipe(
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

  CheckaddiFeature(formdata: FormData) {
    return this.httpClient.post('Check_addiFeature', formdata).pipe(
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

  Excludecontrolstore(formdata: FormData) {
    return this.httpClient.post('Exclude_controlstore', formdata).pipe(
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

  Identifyctrlstore(data: any) {
    return this.httpClient.post('Identify_ctrlstore', { data: data }).pipe(
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
