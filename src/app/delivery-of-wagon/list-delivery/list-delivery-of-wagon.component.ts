import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeliveryOfWagon, MemoOfDelivery} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {DeliveryOfWagonService} from '../delivery-of-wagon.service';

@Component({
  selector: 'app-delivery-of-wagon',
  templateUrl: './list-delivery-of-wagon.component.html',
  styleUrls: ['./list-delivery-of-wagon.component.scss']
})
export class ListDeliveryOfWagonComponent implements OnInit, OnDestroy{

  deliveries: DeliveryOfWagon[] = [];
  deliveryIdToDelete: number;
  deliveriesSub: Subscription;
  delSub: Subscription;

  constructor(private deliveryService: DeliveryOfWagonService,
              public router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.deliveriesSub = this.deliveryService.getAllDeliveries().subscribe(deliverys => {
      this.deliveries = deliverys;
    }, error => {
      throwError(error);
    });
  }

  ngOnDestroy(): void {
    if (this.deliveriesSub) {
      this.deliveriesSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
  }

  delete(): void {
    this.delSub = this.deliveryService.delete(this.deliveryIdToDelete).subscribe((data) => {
      this.alert.success(data.message);
      this.deliveries = this.deliveries.filter(delivery => delivery.deliveryId !== this.deliveryIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Общая подача удалена');
    });
  }

  setDelete(deliveryId: number): void {
    this.deliveryIdToDelete = deliveryId;
  }

  unsetDelete(): void {
    this.deliveryIdToDelete = null;
  }

  getById(deliveryId: number): string {
    if (deliveryId) {
      return this.deliveries.find(value => value.deliveryId === deliveryId).wagon.wagonNumber;
    }
    return '';
  }
}
