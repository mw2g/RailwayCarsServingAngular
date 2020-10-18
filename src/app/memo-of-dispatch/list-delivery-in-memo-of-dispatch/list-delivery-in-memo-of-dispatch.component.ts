import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Customer, DeliveryOfWagon, MemoOfDelivery, MemoOfDispatch} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {MemoOfDispatchService} from '../memo-of-dispatch.service';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';

@Component({
  selector: 'app-delivery-in-memo-of-dispatch',
  templateUrl: './list-delivery-in-memo-of-dispatch.component.html',
  styleUrls: ['./list-delivery-in-memo-of-dispatch.component.scss']
})
export class ListDeliveryInMemoOfDispatchComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  @Input() memoOfDispatchId: number;
  @Input() deliveryList: DeliveryOfWagon[] = [];
  @Input() memoOfDispatch: MemoOfDispatch;
  @Input() enableForm;

  suitableDeliveries: DeliveryOfWagon[] = [];
  deliveryIdToDelete: number;
  deliveryIdToAdd: number;
  public editedDelivery: DeliveryOfWagon;
  // private isNewRecord: boolean;

  private uSub: Subscription;
  private cSub: Subscription;
  private memoSub: Subscription;
  private delSub: Subscription;
  private sDeliverySub: Subscription;
  private addMemoToListSub: Subscription;
  private addMemoSub: Subscription;

  constructor(private deliveryService: DeliveryOfWagonService,
              private customerService: CustomerService,
              private memoOfDeliveryService: MemoOfDispatchService,
              private router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {

    this.loadSuitableDeliveries(this.memoOfDispatchId);
  }

  loadSuitableDeliveries(memoId: number): void {
    this.sDeliverySub = this.deliveryService.getSuitableDeliveriesForMemoOfDispatch(memoId).subscribe(deliveries => {
      this.suitableDeliveries = deliveries;
    }, error => {
      throwError(error);
    });
  }

  // загружаем один из двух шаблонов
  loadTemplate(deliveryOfWagon: DeliveryOfWagon): TemplateRef<any> {
    if (this.editedDelivery && this.editedDelivery.deliveryId === deliveryOfWagon.deliveryId) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // добавление
  // addDelivery(): void {
  //   this.editedDelivery = {
  //     deliveryId: 0,
  //     wagon: {wagonNumber: ''},
  //     memoOfDelivery: {memoOfDeliveryId: this.memoOfDispatch.memoOfDispatchId},
  //     endDate: this.memoOfDispatch.endDate,
  //     customer: {customerName: this.memoOfDispatch.customer.customerName},
  //     cargoOperation: {operationId: this.memoOfDispatch.cargoOperation.operationId}
  //   };
  //   this.deliveryList.push(this.editedDelivery);
  //   this.isNewRecord = true;
  // }

  // редактирование
  editDelivery(delivery: DeliveryOfWagon): void {
    // this.isNewRecord = false;
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
      memoOfDispatch: { memoOfDispatchId: delivery.memoOfDispatch.memoOfDispatchId },
      shuntingWork: delivery.shuntingWork,
      startDate: delivery.startDate,
      wagon: {wagonNumber: delivery.wagon.wagonNumber, wagonType: delivery.wagon.wagonType}
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    // if (this.isNewRecord) {
    //   this.deliveryList.pop();
    //   this.isNewRecord = false;
    // }
    this.editedDelivery = null;
  }

  // сохраняем
  saveDelivery(): void {
    this.editedDelivery.startDate = this.prepareDate(this.editedDelivery.startDate);
    // if (this.isNewRecord) {
    //   // добавляем
    //   this.cSub = this.deliveryService.create(this.editedDelivery).subscribe((data) => {
    //     this.editedDelivery.deliveryId = data.deliveryId;
    //   }, () => {
    //     this.alert.danger('Ошибка');
    //   }, () => {
    //     this.alert.success('Общая подача создана');
    //     this.editedDelivery = null;
    //   });
    //   this.isNewRecord = false;
    // } else {
    // изменяем
    this.uSub = this.deliveryService.update(this.editedDelivery).subscribe((data) => {
      this.deliveryList.map(delivery => {
        if (delivery.deliveryId === this.editedDelivery.deliveryId) {
          delivery.wagon = data.wagon;
          delivery.startDate = data.startDate;
          delivery.cargoWeight = data.cargoWeight;
          delivery.loadUnloadWork = data.loadUnloadWork;
          delivery.memoOfDispatch = data.memoOfDispatch;
        }
      });
    }, () => {
      this.alert.danger('Ошибка тыц');
    }, () => {
      this.alert.success('Общая подача сохранена');
      this.editedDelivery = null;
    });
    // }
  }

  prepareDate(date: Date): Date {
    return date ? new Date(date) : date;
  }

  delete(): void {
    this.delSub = this.deliveryService.delete(this.deliveryIdToDelete).subscribe((data) => {
      this.alert.success(data.message);
      this.deliveryList = this.deliveryList.filter(delivery => delivery.deliveryId !== this.deliveryIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка при удалении общей подачи');
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

  getById(deliveryId: number): number {
    if (deliveryId) {
      return this.deliveryList.find(value => value.deliveryId === deliveryId).deliveryId;
    }
    return 0;
  }

  addDeliveryById(): void {
    if (!this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd)) {
      this.alert.warning('Неподходящая или несуществующая общая подача');
      this.clearDeliveryIdToAdd();
      return;
    }
    this.addMemoSub = this.deliveryService
      .addMemoOfDispatch(this.deliveryIdToAdd.toString(), String(this.memoOfDispatchId)).subscribe((data) => {
        this.clearDeliveryIdToAdd();
        this.alert.success(data.message);
      }, () => {
        this.alert.danger('Ошибка при добавлении общей подачи по номеру');
      }, () => {
        // this.deliveryList.find(delivery => delivery.deliveryId === this.deliveryIdToAdd).memoOfDispatch = this.memoOfDispatch;
      });

    const deliveryOfWagon: DeliveryOfWagon = this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd);
    deliveryOfWagon.memoOfDispatch = this.memoOfDispatch;
    this.deliveryList.push(deliveryOfWagon);
    this.suitableDeliveries = this.suitableDeliveries.filter(delivery => delivery.deliveryId !== this.deliveryIdToAdd);
  }

  removeDeliveryFromMemo(deliveryId): void {
    this.delSub = this.deliveryService.removeMemoOfDispatch(deliveryId).subscribe((data) => {
      // this.alert.success(data.message);
      this.suitableDeliveries.push(this.deliveryList.find(delivery => delivery.deliveryId === deliveryId));
      this.deliveryList = this.deliveryList.filter(delivery => delivery.deliveryId !== deliveryId);
    }, () => {
      this.alert.danger('Ошибка при откреплении общей подачи от памятки');
    }, () => {
      this.alert.success('Общая подача убрана из памятки');
    });
  }

  clearDeliveryIdToAdd(): void {
    this.deliveryIdToAdd = null;
  }

  addAllSuitableDeliveries(): void {
    this.addMemoToListSub = this.deliveryService
      .addMemoOfDispatchToDeliveryList(this.suitableDeliveries.map(delivery => delivery.deliveryId), this.memoOfDispatchId)
      .subscribe((data) => {
        // this.alert.success(data.message);
      }, () => {
        this.alert.danger('Ошибка при добавлении всех подходящих памяток');
      }, () => {
        this.alert.success('Все подходящие вагоны добавлены');
        this.suitableDeliveries.map(delivery => {
          delivery.memoOfDispatch = this.memoOfDispatch;
          delivery.endDate = this.memoOfDispatch.endDate;
        });
        this.deliveryList = this.deliveryList.concat(this.suitableDeliveries);
        this.suitableDeliveries = [];
      });
  }

  removeAllDeliveryOfWagonFromMemo(): void {
    const deliveryIds = this.deliveryList.map(delivery => delivery.deliveryId);
    this.delSub = this.deliveryService.removeMemoOfDispatchFromAllDelivery(deliveryIds).subscribe((data) => {
      // this.alert.success(data.message);
      this.loadSuitableDeliveries(this.memoOfDispatchId);
      this.deliveryList = [];
    }, () => {
      this.alert.danger('Ошибка при откреплении вагонов от памятки');
    }, () => {
      this.alert.success('Все вагоны убраны из памятки');
    });
  }

  ngOnDestroy(): void {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
    if (this.memoSub) {
      this.memoSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
    if (this.sDeliverySub) {
      this.sDeliverySub.unsubscribe();
    }
  }
}
