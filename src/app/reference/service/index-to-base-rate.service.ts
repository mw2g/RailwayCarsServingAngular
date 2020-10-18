import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {IndexToBaseRate} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class IndexToBaseRateService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<IndexToBaseRate>> {
    return this.httpClient.get<Array<IndexToBaseRate>>(`${environment.dbUrl}/api/index-to-base-rate.json`);
  }

  getById(indexId: string): Observable<IndexToBaseRate> {
    return this.httpClient.get<IndexToBaseRate>(`${environment.dbUrl}/api/index-to-base-rate/${indexId}.json`);
  }

  update(indexToBaseRate: IndexToBaseRate): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/index-to-base-rate.json`, indexToBaseRate);
  }

  create(indexToBaseRate: IndexToBaseRate): Observable<IndexToBaseRate> {
    return this.httpClient.post<IndexToBaseRate>(`${environment.dbUrl}/api/index-to-base-rate.json`, indexToBaseRate);
  }

  delete(indexId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/index-to-base-rate/${indexId}.json`);
  }
}
