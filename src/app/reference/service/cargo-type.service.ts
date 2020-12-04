import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CargoType} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class CargoTypeService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<CargoType>> {
    return this.httpClient.get<Array<CargoType>>(`${environment.dbUrl}/api/cargo-type`);
  }

  getById(cargoTypeId: string): Observable<CargoType> {
    return this.httpClient.get<CargoType>(`${environment.dbUrl}/api/cargo-type/${cargoTypeId}`);
  }

  update(customer: CargoType): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.dbUrl}/api/cargo-type`, customer);
  }

  create(customer: CargoType): Observable<CargoType> {
    return this.httpClient.post<CargoType>(`${environment.dbUrl}/api/cargo-type`, customer);
  }

  delete(cargoTypeId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/cargo-type/${cargoTypeId}`);
  }
}
