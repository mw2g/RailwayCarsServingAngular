import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {CargoType, DeliveryOfWagon, Owner} from '../shared/interfaces';

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

  getAllCargoTypes(): Observable<Array<CargoType>> {
    return this.httpClient.get<Array<CargoType>>(`${environment.dbUrl}/api/cargo-type.json`);
  }

  getById(deliveryId: string): Observable<DeliveryOfWagon> {
    return this.httpClient.get<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery/${deliveryId}.json`);
  }

  update(delivery: DeliveryOfWagon): Observable<DeliveryOfWagon> {
    return this.httpClient.put<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery.json`, delivery);
  }

  create(delivery: DeliveryOfWagon): Observable<DeliveryOfWagon> {
    return this.httpClient.post<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery.json`, delivery);
  }

  delete(deliveryId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/delivery/${deliveryId}.json`);
  }

  getDeliveryForAutocomplete(wagonNumber: number): Observable<DeliveryOfWagon> {
    return this.httpClient.get<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery/autocomplete/delivery/${wagonNumber}.json`);
  }

  getSuitableDeliveriesForMemoOfDelivery(memoId: number): Observable<Array<DeliveryOfWagon>> {
    return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/suitable/delivery/${memoId}.json`);
  }

  addMemoOfDelivery(deliveryIdToAdd: string, memoId: string): Observable<DeliveryOfWagon> {
    return this.httpClient.get<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery/add-memo-of-delivery.json`, {
      params: new HttpParams()
        .set(`deliveryIdToAdd`, deliveryIdToAdd)
        .set(`memoId`, memoId)
    });
  }

  addMemoOfDispatch(deliveryIdToAdd: string, memoId: string): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/delivery/add-memo-of-dispatch.json`, {
      params: new HttpParams()
        .set(`deliveryIdToAdd`, deliveryIdToAdd)
        .set(`memoId`, memoId)
    });
  }

  removeMemoOfDelivery(deliveryId: any): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/delivery/remove-memo-of-delivery.json`, {
      params: new HttpParams()
        .set(`deliveryId`, deliveryId)
    });
  }

  removeMemoOfDispatch(deliveryId: any): Observable<{ message: string }> {
    return this.httpClient.get<{ message: string }>(`${environment.dbUrl}/api/delivery/remove-memo-of-dispatch.json`, {
      params: new HttpParams()
        .set(`deliveryId`, deliveryId)
    });
  }

  addMemoOfDeliveryToDeliveryList(deliveryIds: number[], memoId: number): Observable<Array<DeliveryOfWagon>> {
    return this.httpClient.post<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/add-memo-of-delivery-list.json`, {
      deliveryIds,
      memoId
    });
  }

  addMemoOfDispatchToDeliveryList(deliveryIds: number[], memoId: number): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/delivery/add-memo-of-dispatch-list.json`, {
      deliveryIds,
      memoId
    });
  }

  getSuitableDeliveriesForMemoOfDispatch(memoId: number): Observable<Array<DeliveryOfWagon>> {
    return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/suitable/dispatch/${memoId}.json`);
  }

  removeMemoOfDeliveryFromAllDelivery(deliveryIds: number[]): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/delivery/remove-memo-of-delivery-list.json`,
      deliveryIds);
  }

  removeMemoOfDispatchFromAllDelivery(deliveryIds: number[]): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/delivery/remove-memo-of-dispatch-list.json`,
      deliveryIds);
  }

  getAllOwners(): Observable<Array<Owner>> {
    return this.httpClient.get<Array<Owner>>(`${environment.dbUrl}/api/delivery/owner.json`);
  }
}
