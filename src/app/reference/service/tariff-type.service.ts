import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TariffType} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class TariffTypeService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<TariffType>> {
    return this.httpClient.get<Array<TariffType>>(`${environment.dbUrl}/api/tariff-type`);
  }

  getById(typeId: string): Observable<TariffType> {
    return this.httpClient.get<TariffType>(`${environment.dbUrl}/api/tariff-type/${typeId}`);
  }

  update(tariffType: TariffType): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/tariff-type`, tariffType);
  }

  create(tariffType: TariffType): Observable<TariffType> {
    return this.httpClient.post<TariffType>(`${environment.dbUrl}/api/tariff-type`, tariffType);
  }

  delete(typeId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/tariff-type/${typeId}`);
  }
}
