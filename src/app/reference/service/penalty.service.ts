import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Penalty} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class PenaltyService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<Penalty>> {
    return this.httpClient.get<Array<Penalty>>(`${environment.dbUrl}/api/penalty`);
  }

  getById(penaltyId: string): Observable<Penalty> {
    return this.httpClient.get<Penalty>(`${environment.dbUrl}/api/penalty/${penaltyId}`);
  }

  update(penalty: Penalty): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/penalty`, penalty);
  }

  create(penalty: Penalty): Observable<Penalty> {
    return this.httpClient.post<Penalty>(`${environment.dbUrl}/api/penalty`, penalty);
  }

  delete(penaltyId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/penalty/${penaltyId}`);
  }
}
