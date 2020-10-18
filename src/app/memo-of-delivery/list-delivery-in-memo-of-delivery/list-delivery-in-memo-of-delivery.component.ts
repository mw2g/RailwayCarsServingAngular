import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Customer, DeliveryOfWagon, MemoOfDelivery, Owner} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';
import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';

@Component({
  selector: 'app-list-delivery-in-memo-of-delivery',
  templateUrl: './list-delivery-in-memo-of-delivery.component.html',
  styleUrls: ['./list-delivery-in-memo-of-delivery.component.scss']
})
export class ListDeliveryInMemoOfDeliveryComponent implements OnInit, OnDestroy {

  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  @Input() memoOfDeliveryId: number;
  @Input() deliveryList: DeliveryOfWagon[] = [];
  @Input() memoOfDelivery: MemoOfDelivery;
  @Input() enableForm;

  suitableDeliveries: DeliveryOfWagon[] = [];
  deliveryIdToDelete: number;
  deliveryIdToAdd: number;
  public editedDelivery: DeliveryOfWagon;
  private isNewRecord: boolean;

  private uSub: Subscription;
  private cSub: Subscription;
  private memoSub: Subscription;
  private delSub: Subscription;
  private sDeliverySub: Subscription;
  private addMemoToListSub: Subscription;
  private addMemoSub: Subscription;
  private ownerSub: Subscription;
  private ownersList: Owner[] = [];

  constructor(private deliveryService: DeliveryOfWagonService,
              private customerService: CustomerService,
              private memoOfDeliveryService: MemoOfDeliveryService,
              private router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.ownerSub = this.deliveryService.getAllOwners().subscribe(owners => {
      this.ownersList = owners;
    }, error => {
      throwError(error);
    });

    this.loadSuitableDeliveries(this.memoOfDeliveryId);
  }

  public loadSuitableDeliveries(memoId: number): void {
    this.sDeliverySub = this.deliveryService.getSuitableDeliveriesForMemoOfDelivery(memoId).subscribe(deliveries => {
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
  addDelivery(): void {
    this.editedDelivery = {
      deliveryId: 0,
      wagon: {wagonNumber: ''},
      wagonType: {typeId: 0},
      owner: {owner: ''},
      memoOfDelivery: {memoOfDeliveryId: this.memoOfDelivery.memoOfDeliveryId},
      startDate: this.memoOfDelivery.startDate,
      customer: {customerName: this.memoOfDelivery.customer.customerName},
      cargoOperation: {operationId: this.memoOfDelivery.cargoOperation.operationId},
      loadUnloadWork: this.memoOfDelivery.cargoOperation.operationId === 1 ? true : false
    };
    this.deliveryList.push(this.editedDelivery);
    this.isNewRecord = true;
    this.enableForm = false;
  }

  // редактирование
  editDelivery(delivery: DeliveryOfWagon): void {
    this.isNewRecord = false;
    this.editedDelivery = {
      author: delivery.author,
      cargoOperation: delivery.cargoOperation,
      cargoWeight: delivery.cargoWeight,
      cargoType: delivery.cargoType,
      created: delivery.created,
      customer: delivery.customer,
      deliveryId: delivery.deliveryId,
      endDate: delivery.endDate,
      loadUnloadWork: delivery.loadUnloadWork,
      memoOfDelivery: delivery.memoOfDelivery,
      memoOfDispatch: delivery.memoOfDispatch,
      shuntingWork: delivery.shuntingWork,
      startDate: delivery.startDate,
      wagon: {wagonNumber: delivery.wagon.wagonNumber},
      wagonType: {typeId: delivery.wagon.wagonType.typeId},
      owner: {ownerId: delivery.owner.ownerId}
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.deliveryList.pop();
      this.isNewRecord = false;
    }
    this.editedDelivery = null;
    this.enableForm = true;
  }

  // сохраняем
  saveDelivery(): void {
    this.editedDelivery.endDate = this.prepareDate(this.editedDelivery.endDate);
    if (this.isNewRecord) {
      // добавляем
      this.cSub = this.deliveryService.create(this.editedDelivery).subscribe((data) => {
        this.editedDelivery.deliveryId = data.deliveryId;
      }, () => {
        this.deliveryList.pop();
        this.alert.danger('Ошибка при создании общей подачи, возможно данная подача была создана ранее');
      }, () => {
        this.alert.success('Общая подача создана');
        this.editedDelivery = null;
      });
      this.isNewRecord = false;
      this.enableForm = true;
    } else {
      // изменяем
      this.uSub = this.deliveryService.update(this.editedDelivery).subscribe((data) => {
        this.deliveryList.map(delivery => {
          if (delivery.deliveryId === this.editedDelivery.deliveryId) {
            delivery.wagon = data.wagon;
            delivery.wagonType = data.wagonType;
            delivery.owner = data.owner;
            delivery.endDate = data.endDate;
            delivery.cargoWeight = data.cargoWeight;
            delivery.loadUnloadWork = data.loadUnloadWork;
          }
        });
      }, () => {
        this.alert.danger('Ошибка');
      }, () => {
        this.alert.success('Общая подача сохранена');
        this.editedDelivery = null;
        this.enableForm = true;
      });
    }
  }

  prepareDate(date: Date): Date {
    return date ? new Date(date) : date;
  }

  delete(): void {
    this.delSub = this.deliveryService.delete(this.deliveryIdToDelete).subscribe((data) => {
      // this.alert.success(data.message);
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
      this.alert.warning('Нет подходящей подачи с таким номером');
      this.clearDeliveryIdToAdd();
      return;
    }
    this.addMemoSub = this.deliveryService.addMemoOfDelivery(this.deliveryIdToAdd.toString(), String(this.memoOfDeliveryId))
      .subscribe((data) => {
        this.deliveryList.find(delivery => delivery.deliveryId === this.deliveryIdToAdd).memoOfDelivery = data.memoOfDelivery;
        this.clearDeliveryIdToAdd();
      }, () => {
        this.alert.danger('Ошибка при добавлении общей подачи по номеру');
      }, () => {
        this.alert.success('В общую подачу добавлена памятка подачи');
      });

    const deliveryOfWagon: DeliveryOfWagon = this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd);
    this.deliveryList.push(deliveryOfWagon);
    this.suitableDeliveries = this.suitableDeliveries.filter(delivery => delivery.deliveryId !== this.deliveryIdToAdd);
  }

  removeMemoFromDelivery(deliveryId): void {
    this.delSub = this.deliveryService.removeMemoOfDelivery(deliveryId).subscribe((data) => {
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
    this.clearDeliveryIdToAdd();
    this.addMemoToListSub = this.deliveryService
      .addMemoOfDeliveryToDeliveryList(this.suitableDeliveries.map(delivery => delivery.deliveryId), this.memoOfDeliveryId)
      .subscribe((data) => {
        for (const delivery of data) {
          this.deliveryList.find(el => el.deliveryId === delivery.deliveryId).memoOfDelivery = delivery.memoOfDelivery;
        }
      }, () => {
        this.alert.danger('Ошибка при добавлении всех подходящих памяток');
      }, () => {
        this.alert.success('Все подходящие подачи добавлены');
      });

    this.deliveryList = this.deliveryList.concat(this.suitableDeliveries);
    this.suitableDeliveries = [];
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
    if (this.ownerSub) {
      this.ownerSub.unsubscribe();
    }
  }

  removeAllDeliveryOfWagonFromMemo(): void {
    const deliveryIds = this.deliveryList.map(delivery => delivery.deliveryId);
    this.delSub = this.deliveryService.removeMemoOfDeliveryFromAllDelivery(deliveryIds).subscribe((data) => {
      // this.alert.success(data.message);
      this.loadSuitableDeliveries(this.memoOfDeliveryId);
      this.deliveryList = [];
    }, () => {
      this.alert.danger('Ошибка при откреплении вагонов от памятки');
    }, () => {
      this.alert.success('Все вагоны убраны из памятки');
    });
  }

  checkWeight(): void {
    if (this.editedDelivery.cargoWeight > 999) {
      this.editedDelivery.cargoWeight = null;
    }
  }
}
