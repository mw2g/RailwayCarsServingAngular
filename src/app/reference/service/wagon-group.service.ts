import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {WagonGroup} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class WagonGroupService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<WagonGroup>> {
    return this.httpClient.get<Array<WagonGroup>>(`${environment.dbUrl}/api/wagon-group.json`);
  }

  getById(groupId: string): Observable<WagonGroup> {
    return this.httpClient.get<WagonGroup>(`${environment.dbUrl}/api/wagon-group/${groupId}.json`);
  }

  update(wagonGroup: WagonGroup): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/wagon-group.json`, wagonGroup);
  }

  create(wagonGroup: WagonGroup): Observable<WagonGroup> {
    return this.httpClient.post<WagonGroup>(`${environment.dbUrl}/api/wagon-group.json`, wagonGroup);
  }

  delete(groupId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/wagon-group/${groupId}.json`);
  }
}
