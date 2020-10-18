import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {DeliveryOfWagon, MemoOfDispatch} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class MemoOfDispatchService {
  constructor(private httpClient: HttpClient) {
  }

  getAllMemos(): Observable<Array<MemoOfDispatch>> {
    return this.httpClient.get<Array<MemoOfDispatch>>(`${environment.dbUrl}/api/memo/dispatch.json`);
  }

  getById(memoId: string): Observable<MemoOfDispatch> {
    return this.httpClient.get<MemoOfDispatch>(`${environment.dbUrl}/api/memo/dispatch/${memoId}.json`);
  }

  update(memo: MemoOfDispatch): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch.json`, memo);
  }

  create(memo: MemoOfDispatch): Observable<MemoOfDispatch> {
    return this.httpClient.post<MemoOfDispatch>(`${environment.dbUrl}/api/memo/dispatch.json`, memo);
  }

  delete(memoId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/${memoId}.json`);
  }

  getSuitableMemosForControllerStatement(statementId: number): Observable<Array<MemoOfDispatch>> {
    return this.httpClient.get<Array<MemoOfDispatch>>(`${environment.dbUrl}/api/memo/dispatch/suitable/${statementId}.json`);
  }

  addControllerStatement(memoIdToAdd: string, statementId: string): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/add-controller-statement.json`, {
      params: new HttpParams()
        .set(`memoIdToAdd`, memoIdToAdd)
        .set(`statementId`, statementId)
    });
  }

  addControllerStatementToMemoOfDispatchList(memoIds: number[], statementId: number): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/add-controller-statement-list.json`, {
      memoIds,
      statementId
    });
  }

  removeControllerStatement(memoId: any): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/remove-controller-statement.json`, {
      params: new HttpParams()
        .set(`memoId`, memoId)
    });
  }

  removeControllerStatementFromAllMemo(memoIds: number[]): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/memo/dispatch/remove-controller-statement-list.json`,
      memoIds);
  }
}
