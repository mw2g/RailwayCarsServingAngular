import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Statement, StatementRate, StatementWithRate} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class StatementService {
    constructor(private httpClient: HttpClient) {
    }

    getAllStatements(afterDate: Date, beforeDate: Date): Observable<Array<Statement>> {
        return this.httpClient.get<Array<Statement>>(`${environment.dbUrl}/api/statement/${afterDate}/${beforeDate}`);
    }

    getById(statementId: string): Observable<StatementWithRate> {
        return this.httpClient.get<StatementWithRate>(`${environment.dbUrl}/api/statement/${statementId}`);
    }

    update(statement: Statement): Observable<Statement> {
        return this.httpClient.put<Statement>(`${environment.dbUrl}/api/statement`, statement);
    }

    create(statement: Statement): Observable<Statement> {
        return this.httpClient.post<Statement>(`${environment.dbUrl}/api/statement`, statement);
    }

    delete(statementId: number): Observable<{ message: string }> {
        return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/statement/${statementId}`);
    }

    getStatementRate(statementId: number): Observable<StatementRate> {
        return this.httpClient.get<StatementRate>(`${environment.dbUrl}/api/statement/rate/${statementId}`);
    }
}
