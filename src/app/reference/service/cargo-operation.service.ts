import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CargoOperation} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class CargoOperationService {
    operations;

    constructor(private httpClient: HttpClient) {
        this.operations = httpClient.get(`${environment.dbUrl}/api/cargo-operation`);
    }

    getAll(): Observable<Array<CargoOperation>> {
        return this.httpClient.get<Array<CargoOperation>>(`${environment.dbUrl}/api/cargo-operation`);
    }

    getById(operationId: string): Observable<CargoOperation> {
        return this.httpClient.get<CargoOperation>(`${environment.dbUrl}/api/cargo-operation/${operationId}`);
    }

    update(cargoOperation: CargoOperation): Observable<{ response: any }> {
        return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/cargo-operation`, cargoOperation);
    }

    create(cargoOperation: CargoOperation): Observable<CargoOperation> {
        return this.httpClient.post<CargoOperation>(`${environment.dbUrl}/api/cargo-operation`, cargoOperation);
    }

    delete(operationId: number): Observable<{ response: any }> {
        return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/cargo-operation/${operationId}`);
    }
}
