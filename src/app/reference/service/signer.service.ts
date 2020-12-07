import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Signer} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class SignerService {
    constructor(private httpClient: HttpClient) {
    }

    // getAllSigners(): Observable<Array<Signer>> {
    //   return this.httpClient.get<Array<Signer>>(`${environment.dbUrl}/api/customer/signer.json`);
    // }
    //
    // getById(signerId: string): Observable<Signer> {
    //   return this.httpClient.get<Signer>(`${environment.dbUrl}/api/customer/signer/${signerId}.json`);
    // }

    create(signer: Signer): Observable<Signer> {
        return this.httpClient.post<Signer>(`${environment.dbUrl}/api/customer/signer.json`, signer);
    }

    update(signer: Signer): Observable<Signer> {
        return this.httpClient.put<Signer>(`${environment.dbUrl}/api/customer/signer.json`, signer);
    }

    delete(signerId: number): Observable<{ message: string }> {
        return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/customer/signer/${signerId}.json`);
    }
}
