import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {CargoType, DeliveryOfWagon, Owner, StaticReportRow} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class ReportService {
    constructor(private httpClient: HttpClient) {
    }
    getStaticReport(afterDate: Date, beforeDate: Date): Observable<Array<StaticReportRow>> {
        return this.httpClient.get<Array<StaticReportRow>>(`${environment.dbUrl}/api/report/${afterDate}/${beforeDate}`);
    }
    getStaticReportAll(): Observable<Array<StaticReportRow>> {
        return this.httpClient.get<Array<StaticReportRow>>(`${environment.dbUrl}/api/report`);
    }
}
