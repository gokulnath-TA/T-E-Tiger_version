import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TestMeasureService {
  constructor(private httpClient: HttpClient) {}

 
  AnalyseFeature(data: any) {
    return this.httpClient.post('Test_analyzefeature', { data: data }).pipe(
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
  
  SaveStageThree(data:any,stringified_data:any)
  {
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
  
  downloadreports(id:any)
  {
    return this.httpClient.get('download_report/'+ id).pipe(
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

  downloadreports1(id:any)
  {
    return this.httpClient.get('reports/'+ id).pipe(
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
