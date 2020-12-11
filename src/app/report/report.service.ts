import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {GeneralSetReportRow, StaticReportRow} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class ReportService {
    constructor(private httpClient: HttpClient) {
    }

    getStaticReport(afterDate: Date, beforeDate: Date, customer: string): Observable<Array<StaticReportRow>> {
        return this.httpClient
            .post<Array<StaticReportRow>>(`${environment.dbUrl}/api/report/static`, {
                afterDate, beforeDate, customer
            });
    }

    getGeneralSetReport(afterDate: Date, beforeDate: Date,
                        operation: string, customer: string): Observable<Array<GeneralSetReportRow>> {
        return this.httpClient
            .post<Array<GeneralSetReportRow>>(`${environment.dbUrl}/api/report/general-set`, {
                afterDate, beforeDate, operation, customer
            });
    }

}
