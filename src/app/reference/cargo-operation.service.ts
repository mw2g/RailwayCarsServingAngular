import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {CargoOperation} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class CargoOperationService {
  constructor(private httpClient: HttpClient) {
  }

  getAllCargoOperations(): any {
    return this.httpClient.get(`${environment.dbUrl}/api/cargoOperation.json`);
  }

  getById(operationId: string): Observable<CargoOperation> {
    return this.httpClient.get<CargoOperation>(`${environment.dbUrl}/api/cargoOperation/${operationId}.json`);
  }

  // update(cargoOperation: CargoOperation): Observable<{ message: string }> {
  //   return this.httpClient.put<{ message: string }>(`${environment.dbUrl}/api/cargoOperation.json`, cargoOperation);
  // }
  //
  // create(cargoOperation: CargoOperation): Observable<{ message: string }> {
  //   return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/cargoOperation.json`, cargoOperation);
  // }
  //
  // delete(operationId: number): Observable<{ message: string }> {
  //   return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/cargoOperation/${operationId}.json`);
  // }
}
