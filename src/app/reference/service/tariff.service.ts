import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Tariff} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class TariffService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<Tariff>> {
    return this.httpClient.get<Array<Tariff>>(`${environment.dbUrl}/api/tariff.json`);
  }

  getById(tariffId: string): Observable<Tariff> {
    return this.httpClient.get<Tariff>(`${environment.dbUrl}/api/tariff/${tariffId}.json`);
  }

  update(tariff: Tariff): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/tariff.json`, tariff);
  }

  create(tariff: Tariff): Observable<Tariff> {
    return this.httpClient.post<Tariff>(`${environment.dbUrl}/api/tariff.json`, tariff);
  }

  delete(tariffId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/tariff/${tariffId}.json`);
  }
}
