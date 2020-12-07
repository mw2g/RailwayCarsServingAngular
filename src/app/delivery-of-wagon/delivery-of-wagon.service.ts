import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {CargoType, DeliveryOfWagon, Owner} from '../shared/interfaces';

@Injectable({providedIn: 'root'})
export class DeliveryOfWagonService {
    constructor(private httpClient: HttpClient) {
    }

    // getDeliveryByMemoId(memoId: number): Observable<Array<DeliveryOfWagon>> {
    //   return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/memo/${memoId}`);
    // }

    getAllDeliveries(afterDate: Date, beforeDate: Date): Observable<Array<DeliveryOfWagon>> {
        return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/${afterDate}/${beforeDate}`);
    }

    getAllCargoTypes(): Observable<Array<CargoType>> {
        return this.httpClient.get<Array<CargoType>>(`${environment.dbUrl}/api/cargo-type`);
    }

    getById(deliveryId: string): Observable<DeliveryOfWagon> {
        return this.httpClient.get<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery/${deliveryId}`);
    }

    update(delivery: DeliveryOfWagon): Observable<DeliveryOfWagon> {
        return this.httpClient.put<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery`, delivery);
    }

    create(delivery: DeliveryOfWagon): Observable<DeliveryOfWagon> {
        return this.httpClient.post<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery`, delivery);
    }

    delete(deliveryId: number): Observable<{ message: string }> {
        return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/delivery/${deliveryId}`);
    }

    getDeliveryForAutocomplete(wagonNumber: string): Observable<DeliveryOfWagon> {
        return this.httpClient.get<DeliveryOfWagon>(`${environment.dbUrl}/api/delivery/autocomplete/delivery/${wagonNumber}`);
    }

    getSuitableDeliveriesForMemoOfDelivery(memoId: number): Observable<Array<DeliveryOfWagon>> {
        return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/suitable/delivery/${memoId}`);
    }

    addMemoOfDelivery(deliveryIdToAdd: string, memoId: string): Observable<any> {
        return this.httpClient.get<any>(`${environment.dbUrl}/api/delivery/add-memo-of-delivery`, {
            params: new HttpParams()
                .set(`deliveryIdToAdd`, deliveryIdToAdd)
                .set(`memoId`, memoId)
        });
    }

    addMemoOfDispatch(deliveryIdToAdd: string, memoId: string): Observable<boolean> {
        return this.httpClient.get<boolean>(`${environment.dbUrl}/api/delivery/add-memo-of-dispatch`, {
            params: new HttpParams()
                .set(`deliveryIdToAdd`, deliveryIdToAdd)
                .set(`memoId`, memoId)
        });
    }

    removeMemoOfDelivery(deliveryId: any): Observable<any> {
        return this.httpClient.get<any>(`${environment.dbUrl}/api/delivery/remove-memo-of-delivery`, {
            params: new HttpParams()
                .set(`deliveryId`, deliveryId)
        });
    }

    removeMemoOfDispatch(deliveryId: any): Observable<boolean> {
        return this.httpClient.get<boolean>(`${environment.dbUrl}/api/delivery/remove-memo-of-dispatch`, {
            params: new HttpParams()
                .set(`deliveryId`, deliveryId)
        });
    }

    addMemoOfDeliveryToDeliveryList(deliveryIds: number[], memoId: number): Observable<any> {
        return this.httpClient.post<any>(`${environment.dbUrl}/api/delivery/add-memo-of-delivery-list`, {
            deliveryIds,
            memoId
        });
    }

    addMemoOfDispatchToDeliveryList(deliveryIds: number[], memoId: number): Observable<boolean> {
        return this.httpClient.post<boolean>(`${environment.dbUrl}/api/delivery/add-memo-of-dispatch-list`, {
            deliveryIds,
            memoId
        });
    }

    getSuitableDeliveriesForMemoOfDispatch(memoId: number): Observable<Array<DeliveryOfWagon>> {
        return this.httpClient.get<Array<DeliveryOfWagon>>(`${environment.dbUrl}/api/delivery/suitable/dispatch/${memoId}`);
    }

    removeMemoOfDeliveryFromAllDelivery(deliveryIds: number[]): Observable<{ message: string }> {
        return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/delivery/remove-memo-of-delivery-list`,
            deliveryIds);
    }

    removeMemoOfDispatchFromAllDelivery(deliveryIds: number[]): Observable<{ message: string }> {
        return this.httpClient.post<{ message: string }>(`${environment.dbUrl}/api/delivery/remove-memo-of-dispatch-list`,
            deliveryIds);
    }

    getAllOwners(): Observable<Array<Owner>> {
        return this.httpClient.get<Array<Owner>>(`${environment.dbUrl}/api/delivery/owner`);
    }

    getBaseRateAndPenalty(deliveryId: number, payTime: number, date: Date): Observable<{ baseRate: number, penalty: number }> {
        return this.httpClient.post<{ baseRate: number, penalty: number }>(`${environment.dbUrl}/api/delivery/base-rate-and-penalty`, {
            deliveryId,
            payTime,
            date
        });
    }
}
