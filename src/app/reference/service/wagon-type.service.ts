import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {WagonType} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class WagonTypeService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<WagonType>> {
    return this.httpClient.get<Array<WagonType>>(`${environment.dbUrl}/api/wagon-type.json`);
  }

  getById(typeId: string): Observable<WagonType> {
    return this.httpClient.get<WagonType>(`${environment.dbUrl}/api/wagon-type/${typeId}.json`);
  }

  update(wagonType: WagonType): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/wagon-type.json`, wagonType);
  }

  create(wagonType: WagonType): Observable<WagonType> {
    return this.httpClient.post<WagonType>(`${environment.dbUrl}/api/wagon-type.json`, wagonType);
  }

  delete(typeId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/wagon-type/${typeId}.json`);
  }
}
