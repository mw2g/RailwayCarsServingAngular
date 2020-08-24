import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {MemoOfDelivery} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class MemoOfDeliveryService {
  constructor(private httpClient: HttpClient) {
  }

  getAllMemos(): Observable<Array<MemoOfDelivery>> {
    return this.httpClient.get<Array<MemoOfDelivery>>(`${environment.dbUrl}/api/memo/delivery.json`);
  }

  getById(memoId: string): Observable<MemoOfDelivery> {
    return this.httpClient.get<MemoOfDelivery>(`${environment.dbUrl}/api/memo/delivery/${memoId}.json`);
  }

  update(memo: MemoOfDelivery): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.dbUrl}/api/memo/delivery.json`, memo);
  }

  create(memo: MemoOfDelivery): Observable<MemoOfDelivery> {
    return this.httpClient.post<MemoOfDelivery>(`${environment.dbUrl}/api/memo/delivery.json`, memo);
  }

  delete(memoId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/memo/delivery/${memoId}.json`);
  }
}
