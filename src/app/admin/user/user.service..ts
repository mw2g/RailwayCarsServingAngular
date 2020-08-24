import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {User} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private httpClient: HttpClient) {
  }

  getAllUsers(): Observable<Array<User>> {
    return this.httpClient.get<Array<User>>(`${environment.dbUrl}/api/admin/user.json`);
  }

  getById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.dbUrl}/api/admin/user/${userId}.json`);
  }

  update(user: User): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.dbUrl}/api/admin/user.json`, user);
  }

  create(user: User): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/admin/user.json`, user);
  }

  delete(userId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/admin/user/${userId}.json`);
  }

  kickOut(refreshTokenId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/auth/${refreshTokenId}.json`);
  }
}
