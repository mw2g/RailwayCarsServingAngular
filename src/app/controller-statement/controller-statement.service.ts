import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ControllerStatement} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class ControllerStatementService {
  constructor(private httpClient: HttpClient) {
  }

  getAllStatements(): Observable<Array<ControllerStatement>> {
    return this.httpClient.get<Array<ControllerStatement>>(`${environment.dbUrl}/api/controller-statement.json`);
  }

  getById(statementId: string): Observable<ControllerStatement> {
    return this.httpClient.get<ControllerStatement>(`${environment.dbUrl}/api/controller-statement/${statementId}.json`);
  }

  update(statement: ControllerStatement): Observable<ControllerStatement> {
    return this.httpClient.put<ControllerStatement>(`${environment.dbUrl}/api/controller-statement.json`, statement);
  }

  create(statement: ControllerStatement): Observable<ControllerStatement> {
    return this.httpClient.post<ControllerStatement>(`${environment.dbUrl}/api/controller-statement.json`, statement);
  }

  delete(statementId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/controller-statement/${statementId}.json`);
  }
}
