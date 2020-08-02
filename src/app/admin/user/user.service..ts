import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserPayload} from './user.payload';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<Array<UserPayload>> {
    return this.httpClient.get<Array<UserPayload>>('http://localhost:8080/api/admin/users');
  }
}
