import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {BaseRate, CargoType, DeliveryOfWagon, Owner, Penalty} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class DeliveryOfWagonService {
  constructor(private httpClient: HttpClient) {
  }

  // getDeliveryByMemoId(memoId: number): Observable<Array<DeliveryOfWagon>> {
  //   return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/memo/${memoId}.json`);
  // }

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

  getDeliveryForAutocomplete(wagonNumber: string): Observable<DeliveryOfWagon> {
    return this.httpClient.get<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery/autocomplete/delivery/${wagonNumber}.json`);
  }

  getSuitableDeliveriesForMemoOfDelivery(memoId: number): Observable<Array<DeliveryOfWagon>> {
    return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/suitable/delivery/${memoId}.json`);
  }

  addMemoOfDelivery(deliveryIdToAdd: string, memoId: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.dbUrl}/api/delivery/add-memo-of-delivery.json`, {
      params: new HttpParams()
        .set(`deliveryIdToAdd`, deliveryIdToAdd)
        .set(`memoId`, memoId)
    });
  }

  addMemoOfDispatch(deliveryIdToAdd: string, memoId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.dbUrl}/api/delivery/add-memo-of-dispatch.json`, {
      params: new HttpParams()
        .set(`deliveryIdToAdd`, deliveryIdToAdd)
        .set(`memoId`, memoId)
    });
  }

  removeMemoOfDelivery(deliveryId: any): Observable<any> {
    return this.httpClient.get<any>(`${environment.dbUrl}/api/delivery/remove-memo-of-delivery.json`, {
      params: new HttpParams()
        .set(`deliveryId`, deliveryId)
    });
  }

  removeMemoOfDispatch(deliveryId: any): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.dbUrl}/api/delivery/remove-memo-of-dispatch.json`, {
      params: new HttpParams()
        .set(`deliveryId`, deliveryId)
    });
  }

  addMemoOfDeliveryToDeliveryList(deliveryIds: number[], memoId: number): Observable<any> {
    return this.httpClient.post<any>(`${environment.dbUrl}/api/delivery/add-memo-of-delivery-list.json`, {
      deliveryIds,
      memoId
    });
  }

  addMemoOfDispatchToDeliveryList(deliveryIds: number[], memoId: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.dbUrl}/api/delivery/add-memo-of-dispatch-list.json`, {
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

  getBaseRateAndPenalty(deliveryId: number, payTime: number, date: Date): Observable<{ baseRate: number, penalty: number }> {
    return this.httpClient.post<{ baseRate: number, penalty: number }>(`${environment.dbUrl}/api/delivery/base-rate-and-penalty.json`, {
      deliveryId,
      payTime,
      date
    });
  }
}
