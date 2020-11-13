import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TimeNorm} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class TimeNormService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<TimeNorm>> {
    return this.httpClient.get<Array<TimeNorm>>(`${environment.dbUrl}/api/time-norm.json`);
  }

  getById(normId: string): Observable<TimeNorm> {
    return this.httpClient.get<TimeNorm>(`${environment.dbUrl}/api/time-norm/${normId}.json`);
  }

  update(timeNorm: TimeNorm): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/time-norm.json`, timeNorm);
  }

  create(timeNorm: TimeNorm): Observable<TimeNorm> {
    return this.httpClient.post<TimeNorm>(`${environment.dbUrl}/api/time-norm.json`, timeNorm);
  }

  delete(normId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/time-norm/${normId}.json`);
  }
}
