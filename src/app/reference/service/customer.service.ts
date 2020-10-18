import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Customer} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class CustomerService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<Customer>> {
    return this.httpClient.get<Array<Customer>>(`${environment.dbUrl}/api/customer.json`);
  }

  getById(customerId: string): Observable<Customer> {
    return this.httpClient.get<Customer>(`${environment.dbUrl}/api/customer/${customerId}.json`);
  }

  update(customer: Customer): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.dbUrl}/api/customer.json`, customer);
  }

  create(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(`${environment.dbUrl}/api/customer.json`, customer);
  }

  delete(customerId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/customer/${customerId}.json`);
  }
}
