import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Customer, DeliveryOfWagon, MemoOfDelivery} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/customer.service';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';

@Component({
  selector: 'app-delivery-in-memo-of-delivery',
  templateUrl: './list-delivery-in-memo-of-delivery.component.html',
  styleUrls: ['./list-delivery-in-memo-of-delivery.component.scss']
})
export class ListDeliveryInMemoOfDeliveryComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  @Input() memoId: string;

  deliveries: DeliveryOfWagon[] = [];
  suitableDeliveries: DeliveryOfWagon[] = [];
  deliveryIdToDelete: number;
  deliveryIdToAdd: number;
  memoSub: Subscription;
  delSub: Subscription;

  memoOfDelivery: MemoOfDelivery;

  editedDelivery: DeliveryOfWagon;
  isNewRecord: boolean;
  statusMessage: string;

  private uSub: Subscription;
  private customersSub: Subscription;
  private customers: Array<Customer>;

  constructor(private deliveryService: DeliveryOfWagonService,
              private customerService: CustomerService,
              private memoOfDeliveryService: MemoOfDeliveryService,
              private router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.customersSub = this.customerService.getAllCustomers().subscribe(customers => {
      this.customers = customers;
    }, error => {
      throwError(error);
    });
    if (this.memoId !== undefined) {
      this.memoSub = this.memoOfDeliveryService.getById(this.memoId).subscribe(memo => {
        this.deliveries = memo.deliveryOfWagonList;
        this.memoOfDelivery = memo;
        this.loadSuitableDeliveries(memo.memoId);
      }, error => {
        throwError(error);
      });

      // this.deliveriesSub = this.deliveryService.getDeliveryByMemoId(this.memoId).subscribe(deliveries => {
      //   this.deliveries = deliveries;
      // }, error => {
      //   throwError(error);
      // });
    }
  }

  loadSuitableDeliveries(memoId: number): void {
    this.deliveryService.getSuitableDeliveries(memoId).subscribe(deliveries => {
      this.suitableDeliveries = deliveries;
    }, error => {
      throwError(error);
    });
  }

  ngOnDestroy(): void {
    if (this.memoSub) {
      this.memoSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
  }

  // загружаем один из двух шаблонов
  loadTemplate(deliveryOfWagon: DeliveryOfWagon): TemplateRef<any> {
    if (this.editedDelivery && this.editedDelivery.deliveryId === deliveryOfWagon.deliveryId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // добавление пользователя
  addDelivery(): void {
    this.editedDelivery = {
      deliveryId: 0,
      wagon: {wagonNumber: ''},
      memoOfDelivery: {memoId: this.memoOfDelivery.memoId},
      startDate: this.memoOfDelivery.startDate,
      customer: {customerName: this.memoOfDelivery.customer.customerName},
      cargoOperation: {operationId: this.memoOfDelivery.cargoOperation.operationId}
    };
    this.deliveries.push(this.editedDelivery);
    this.isNewRecord = true;
  }

  // редактирование пользователя
  editDelivery(delivery: DeliveryOfWagon): void {
    this.isNewRecord = false;
    this.editedDelivery = {
      author: delivery.author,
      cargoOperation: delivery.cargoOperation,
      cargoWeight: delivery.cargoWeight,
      created: delivery.created,
      customer: delivery.customer,
      deliveryId: delivery.deliveryId,
      endDate: delivery.endDate,
      loadUnloadWork: delivery.loadUnloadWork,
      memoOfDelivery: delivery.memoOfDelivery,
      shuntingWork: delivery.shuntingWork,
      startDate: delivery.startDate,
      wagon: delivery.wagon
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.deliveries.pop();
      this.isNewRecord = false;
    }
    this.editedDelivery = null;
  }

  // сохраняем пользователя
  saveDelivery(): void {
    this.editedDelivery.endDate = this.prepareDate(this.editedDelivery.endDate);
    if (this.isNewRecord) {
      // добавляем пользователя
      this.uSub = this.deliveryService.create(this.editedDelivery).subscribe((data) => {
        this.alert.success(data.message);
        // this.submitted = true;
      }, () => {
        this.alert.danger('Ошибка');
      });

      this.isNewRecord = false;
      this.editedDelivery = null;
    } else {
      // изменяем пользователя
      this.uSub = this.deliveryService.update(this.editedDelivery).subscribe((data) => {
        this.alert.success(data.message);
        // this.submitted = true;
      }, () => {
        this.alert.danger('Ошибка');
      });
      this.editedDelivery = null;
    }
  }

  prepareDate(date: Date): Date {
    return date ? new Date(date) : date;
  }

  delete(): void {
    this.delSub = this.deliveryService.delete(this.deliveryIdToDelete).subscribe((data) => {
      this.alert.success(data.message);
      this.deliveries = this.deliveries.filter(delivery => delivery.deliveryId !== this.deliveryIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Пользователь удален');
    });
  }

  setDelete(deliveryId: number): void {
    this.deliveryIdToDelete = deliveryId;
  }

  unsetDelete(): void {
    this.deliveryIdToDelete = null;
  }

  getById(deliveryId: number): number {
    if (deliveryId) {
      return this.deliveries.find(value => value.deliveryId === deliveryId).deliveryId;
    }
    return 0;
  }

  addDeliveryById(): void {
    if (!this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd)) {
      return;
    }
    this.deliveryService.addMemo(this.deliveryIdToAdd.toString(), this.memoId).subscribe((data) => {
      this.clearDeliveryIdToAdd();
      this.alert.success(data.message);
      // this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });

    const deliveryOfWagon: DeliveryOfWagon = this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd);
    this.deliveries.push(deliveryOfWagon);
    this.suitableDeliveries = this.suitableDeliveries.filter(delivery => delivery.deliveryId !== this.deliveryIdToAdd);
  }

  removeMemoFromDelivery(deliveryId): void {
    this.delSub = this.deliveryService.removeMemo(deliveryId).subscribe((data) => {
      this.alert.success(data.message);
      this.suitableDeliveries.push(this.deliveries.find(delivery => delivery.deliveryId === deliveryId));
      this.deliveries = this.deliveries.filter(delivery => delivery.deliveryId !== deliveryId);
      // this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Пользователь удален');
    });
  }

  clearDeliveryIdToAdd(): void {
    this.deliveryIdToAdd = null;
  }

  addAllSuitableDeliveries(): void {
    this.deliveryService.addMemoToDeliveryList(this.suitableDeliveries.map(delivery => delivery.deliveryId), this.memoId)
      .subscribe((data) => {
      this.alert.success(data.message);
      // this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });

    this.deliveries = this.deliveries.concat(this.suitableDeliveries);
    this.suitableDeliveries = null;
  }
}
