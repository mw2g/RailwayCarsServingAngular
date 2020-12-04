import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {DeliveryOfWagon, MemoOfDispatch} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class MemoOfDispatchService {
  constructor(private httpClient: HttpClient) {
  }

    getAllMemos(afterDate: Date, beforeDate: Date): Observable<Array<MemoOfDispatch>> {
    return this.httpClient.get<Array<MemoOfDispatch>>(`${environment.dbUrl}/api/memo/dispatch/${afterDate}/${beforeDate}`);
  }

  getById(memoId: string): Observable<MemoOfDispatch> {
    return this.httpClient.get<MemoOfDispatch>(`${environment.dbUrl}/api/memo/dispatch/${memoId}`);
  }

  update(memo: MemoOfDispatch): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch`, memo);
  }

  create(memo: MemoOfDispatch): Observable<MemoOfDispatch> {
    return this.httpClient.post<MemoOfDispatch>(`${environment.dbUrl}/api/memo/dispatch`, memo);
  }

  delete(memoId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/${memoId}`);
  }

  getSuitableMemosForStatement(statementId: number): Observable<Array<MemoOfDispatch>> {
    return this.httpClient.get<Array<MemoOfDispatch>>(`${environment.dbUrl}/api/memo/dispatch/suitable/${statementId}`);
  }

  addStatement(memoIdToAdd: string, statementId: string): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/add-statement`, {
      params: new HttpParams()
        .set(`memoIdToAdd`, memoIdToAdd)
        .set(`statementId`, statementId)
    });
  }

  addStatementToMemoOfDispatchList(memoIds: number[], statementId: number): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/add-statement-list`, {
      memoIds,
      statementId
    });
  }

  removeStatement(memoId: any): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/remove-statement`, {
      params: new HttpParams()
        .set(`memoId`, memoId)
    });
  }

  removeStatementFromAllMemo(memoIds: number[]): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/remove-statement-list`,
      memoIds);
  }
}
