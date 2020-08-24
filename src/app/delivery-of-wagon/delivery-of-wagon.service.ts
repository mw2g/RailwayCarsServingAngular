import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {DeliveryOfWagon} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class DeliveryOfWagonService {
  constructor(private httpClient: HttpClient) {
  }

  getDeliveryByMemoId(memoId: number): Observable<Array<DeliveryOfWagon>> {
    return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/memo/${memoId}.json`);
  }

  getAllDeliveries(): Observable<Array<DeliveryOfWagon>> {
    return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery.json`);
  }

  getById(deliveryId: string): Observable<DeliveryOfWagon> {
    return this.httpClient.get<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery/${deliveryId}.json`);
  }

  update(delivery: DeliveryOfWagon): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${environment.dbUrl}/api/delivery.json`, delivery);
  }

  create(delivery: DeliveryOfWagon): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/delivery.json`, delivery);
  }

  delete(deliveryId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/delivery/${deliveryId}.json`);
  }

  getSuitableDeliveries(memoId: number): Observable<Array<DeliveryOfWagon>> {
    return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/suitable/${memoId}.json`);
  }

  addMemo(deliveryIdToAdd: string, memoId: string): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/delivery/add-memo.json`, {
      params: new HttpParams()
        .set(`deliveryIdToAdd`, deliveryIdToAdd)
        .set(`memoId`, memoId)
    });
  }

  removeMemo(deliveryId: any): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/delivery/remove-memo.json`, {
      params: new HttpParams()
        .set(`deliveryId`, deliveryId)
    });
  }

  addMemoToDeliveryList(deliveryIds: number[], memoId: string): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/delivery/add-memo-list.json`, {
      deliveryIds,
      memoId
    });
  }
}
