import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DeliveryOfWagon, MemoOfDispatch, Owner, WagonType} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {MemoOfDispatchService} from '../memo-of-dispatch.service';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';
import {WagonTypeService} from '../../reference/service/wagon-type.service';
import {UtilsService} from '../../shared/service/utils.service';

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
  private isNewRecord: boolean;

  private updateSub: Subscription;
  private createSub: Subscription;
  private memoSub: Subscription;
  private delMemoSub: Subscription;
  private suitableDeliverySub: Subscription;
  private addMemoToListSub: Subscription;
  private addMemoSub: Subscription;
  wagonTypeSub: Subscription;
  wagonTypeList: Array<WagonType>;
  private ownerSub: Subscription;
  ownersList: Array<Owner>;

  constructor(private deliveryService: DeliveryOfWagonService,
              private customerService: CustomerService,
              private memoOfDeliveryService: MemoOfDispatchService,
              private wagonTypeService: WagonTypeService,
              private router: Router,
              private alert: AlertService,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.loadSuitableDeliveries(this.memoOfDispatchId);
  }

  loadSuitableDeliveries(memoId: number): void {
    this.suitableDeliverySub = this.deliveryService.getSuitableDeliveriesForMemoOfDispatch(memoId).subscribe(deliveries => {
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

  // редактирование
  editDelivery(delivery: DeliveryOfWagon): void {
    this.isNewRecord = false;
    this.editedDelivery = {
      ...delivery
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
  }

  // сохраняем
  saveDelivery(): void {
    this.editedDelivery.startDate = this.prepareDate(this.editedDelivery.startDate);
    if (this.isNewRecord) {
      // добавляем
      this.createSub = this.deliveryService.create(this.editedDelivery).subscribe((data) => {
        this.editedDelivery.deliveryId = data.deliveryId;
      }, () => {
        this.alert.danger('Ошибка');
      }, () => {
        this.alert.success('Общая подача создана');
        this.editedDelivery = null;
      });
      this.isNewRecord = false;
    } else {
    // изменяем
    this.updateSub = this.deliveryService.create(this.editedDelivery).subscribe((data) => {
      this.deliveryList.map(delivery => {
        if (delivery.deliveryId === this.editedDelivery.deliveryId) {
          delivery.wagonType = data.wagonType;
          delivery.cargoType = data.cargoType;
          delivery.owner = data.owner;
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

  setDelete(deliveryId: number): void {
    this.deliveryIdToDelete = deliveryId;
  }

  unsetDelete(): void {
    this.deliveryIdToDelete = null;
  }

  delete(): void {
    this.delMemoSub = this.deliveryService.delete(this.deliveryIdToDelete).subscribe((data) => {
      this.alert.success(data.message);
      this.deliveryList = this.deliveryList.filter(delivery => delivery.deliveryId !== this.deliveryIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка при удалении общей подачи');
    }, () => {
      this.alert.success('Общая подача удалена');
    });
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
    this.addMemoSub = this.deliveryService.addMemoOfDispatch(this.deliveryIdToAdd.toString(), String(this.memoOfDispatchId))
      .subscribe((data) => {
        this.deliveryList.find(delivery => delivery.deliveryId === this.deliveryIdToAdd)
          .memoOfDispatch = this.memoOfDispatch.memoOfDispatchId;
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

  removeDeliveryFromMemo(deliveryId): void {
    this.delMemoSub = this.deliveryService.removeMemoOfDispatch(deliveryId).subscribe(() => {
    }, () => {
      this.alert.danger('Ошибка при откреплении общей подачи от памятки');
    }, () => {
      this.suitableDeliveries.push(this.deliveryList.find(delivery => delivery.deliveryId === deliveryId));
      this.deliveryList = this.deliveryList.filter(delivery => delivery.deliveryId !== deliveryId);
      this.alert.success('Общая подача убрана из памятки');
    });
  }

  clearDeliveryIdToAdd(): void {
    this.deliveryIdToAdd = null;
  }

  addAllSuitableDeliveries(): void {
    this.addMemoToListSub = this.deliveryService
      .addMemoOfDispatchToDeliveryList(this.suitableDeliveries.map(delivery => delivery.deliveryId), this.memoOfDispatchId)
      .subscribe(() => {
      }, () => {
        this.alert.danger('Ошибка при добавлении всех подходящих памяток');
      }, () => {
        this.alert.success('Все подходящие вагоны добавлены');
        this.suitableDeliveries.map(delivery => {
          delivery.memoOfDispatch = this.memoOfDispatch.memoOfDispatchId;
          delivery.endDate = this.memoOfDispatch.endDate;
        });
        this.deliveryList = this.deliveryList.concat(this.suitableDeliveries);
        this.suitableDeliveries = [];
      });
  }

  removeAllDeliveryOfWagonFromMemo(): void {
    const deliveryIds = this.deliveryList.map(delivery => delivery.deliveryId);
    this.delMemoSub = this.deliveryService.removeMemoOfDispatchFromAllDelivery(deliveryIds).subscribe(() => {
      this.loadSuitableDeliveries(this.memoOfDispatchId);
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

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.memoSub,
      this.createSub,
      this.updateSub,
      this.delMemoSub,
      this.addMemoSub,
      this.delMemoSub,
      this.addMemoToListSub,
      this.suitableDeliverySub
    ]);
  }
}
