import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Setting} from '../../shared/interfaces';

@Injectable({providedIn: 'root'})
export class SettingService {
    constructor(private httpClient: HttpClient) {
    }

    getAll(): Observable<Array<Setting>> {
        return this.httpClient.get<Array<Setting>>(`${environment.dbUrl}/api/setting`);
    }

    // getById(settingId: string): Observable<Setting> {
    //     return this.httpClient.get<Setting>(`${environment.dbUrl}/api/setting/${settingId}`);
    // }

    getByType(settingTypes: string[]): Observable<Array<string>> {
        return this.httpClient.post<Array<string>>(`${environment.dbUrl}/api/setting/get-setting`, settingTypes);
    }

    update(setting: Setting): Observable<{ response: any }> {
        return this.httpClient.put<{ response: any }>(`${environment.dbUrl}/api/setting`, setting);
    }

    create(setting: Setting): Observable<Setting> {
        return this.httpClient.post<Setting>(`${environment.dbUrl}/api/setting`, setting);
    }

    delete(settingId: number): Observable<{ response: any }> {
        return this.httpClient.delete<{ response: any }>(`${environment.dbUrl}/api/setting/${settingId}`);
    }
}
