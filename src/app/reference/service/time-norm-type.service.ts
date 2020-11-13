import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TimeNormType} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class TimeNormTypeService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<TimeNormType>> {
    return this.httpClient.get<Array<TimeNormType>>(`${environment.dbUrl}/api/time-norm-type.json`);
  }

  getById(typeId: string): Observable<TimeNormType> {
    return this.httpClient.get<TimeNormType>(`${environment.dbUrl}/api/time-norm-type/${typeId}.json`);
  }

  update(timeNormType: TimeNormType): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/time-norm-type.json`, timeNormType);
  }

  create(timeNormType: TimeNormType): Observable<TimeNormType> {
    return this.httpClient.post<TimeNormType>(`${environment.dbUrl}/api/time-norm-type.json`, timeNormType);
  }

  delete(typeId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/time-norm-type/${typeId}.json`);
  }
}
