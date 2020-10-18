import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CargoOperation} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class CargoOperationService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<CargoOperation>> {
    return this.httpClient.get<Array<CargoOperation>>(`${environment.dbUrl}/api/cargo-operation.json`);
  }

  getById(operationId: string): Observable<CargoOperation> {
    return this.httpClient.get<CargoOperation>(`${environment.dbUrl}/api/cargo-operation/${operationId}.json`);
  }

  update(cargoOperation: CargoOperation): Observable<{ response: any }> {
    return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/cargo-operation.json`, cargoOperation);
  }

  create(cargoOperation: CargoOperation): Observable<CargoOperation> {
    return this.httpClient.post<CargoOperation>(`${environment.dbUrl}/api/cargo-operation.json`, cargoOperation);
  }

  delete(operationId: number): Observable<{ response: any }> {
    return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/cargo-operation/${operationId}.json`);
  }
}
