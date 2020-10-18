import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BaseRate} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class BaseRateService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<BaseRate>> {
    return this.httpClient.get<Array<BaseRate>>(`${environment.dbUrl}/api/base-rate.json`);
  }

  getById(rateId: string): Observable<BaseRate> {
    return this.httpClient.get<BaseRate>(`${environment.dbUrl}/api/base-rate/${rateId}.json`);
  }

  update(baseRate: BaseRate): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/base-rate.json`, baseRate);
  }

  create(baseRate: BaseRate): Observable<BaseRate> {
    return this.httpClient.post<BaseRate>(`${environment.dbUrl}/api/base-rate.json`, baseRate);
  }

  delete(rateId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/base-rate/${rateId}.json`);
  }
}
