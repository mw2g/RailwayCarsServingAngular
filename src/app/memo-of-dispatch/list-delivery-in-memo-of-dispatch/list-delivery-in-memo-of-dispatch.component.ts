import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DeliveryOfWagon, MemoOfDispatch} from '../../shared/interfaces';
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
    @Input() memoOfDispatch: MemoOfDispatch;
    @Input() enableForm;

    suitableDeliveries: DeliveryOfWagon[] = [];
    deliveryIdToAdd: number;
    deliveryIdToRemove: number;
    weightForAll: number;
    shuntingForAll: number;
    weightFocus = false;
    public editedDelivery: DeliveryOfWagon;

    private updateSub: Subscription;
    private createSub: Subscription;
    private memoSub: Subscription;
    private delMemoSub: Subscription;
    private suitableDeliverySub: Subscription;
    private addMemoToListSub: Subscription;
    private addMemoSub: Subscription;

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
    editDelivery(delivery: DeliveryOfWagon, focus?: string): void {
        this.weightFocus = focus === 'weight' ? true : false;
        this.editedDelivery = {
            ...delivery
        };
    }

    // отмена редактирования
    cancel(): void {
        this.editedDelivery = null;
    }

    // сохраняем
    saveDelivery(editNext?): void {
        const deliveryId = this.editedDelivery.deliveryId;
        this.updateSub = this.deliveryService.update(this.editedDelivery).subscribe((data) => {
            this.memoOfDispatch.deliveryOfWagonList.map(delivery => {
                if (delivery.deliveryId === this.editedDelivery.deliveryId) {
                    delivery.shuntingWorks = data.shuntingWorks;
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
            if (editNext) {
                let next = false;
                for (const delivery of this.memoOfDispatch.deliveryOfWagonList.values()) {
                    if (next) {
                        this.editDelivery(delivery, editNext);
                        break;
                    }
                    next = delivery.deliveryId === deliveryId ? true : false;
                }
            }
        });
    }

    // сохраняем все
    saveAllDeliveries(): void {
        for (const delivery of this.memoOfDispatch.deliveryOfWagonList) {
            this.updateSub = this.deliveryService.update(delivery).subscribe(() => {
            }, () => {
                this.alert.danger('Ошибка');
            }, () => {
                this.alert.success('Успешно');
                this.enableForm = true;
            });
        }
    }

    getById(deliveryId: number): number {
        if (deliveryId) {
            return this.memoOfDispatch.deliveryOfWagonList.find(value => value.deliveryId === deliveryId).deliveryId;
        }
        return 0;
    }

    addDeliveryById(): void {
        if (!this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd)) {
            this.alert.warning('Нет подходящей подачи с таким номером');
            this.deliveryIdToAdd = null;
            return;
        }
        this.addMemoSub = this.deliveryService.addMemoOfDispatch(this.deliveryIdToAdd.toString(), String(this.memoOfDispatchId))
            .subscribe((data) => {
                this.memoOfDispatch.deliveryOfWagonList.map(delivery => {
                    if (delivery.deliveryId === this.deliveryIdToAdd) {
                        delivery.memoOfDispatch = this.memoOfDispatch.memoOfDispatchId;
                        delivery.endDate = this.memoOfDispatch.endDate;
                    }
                });
                this.deliveryIdToAdd = null;
            }, () => {
                this.alert.danger('Ошибка при добавлении общей подачи по номеру');
            }, () => {
                this.alert.success('В общую подачу добавлена памятка подачи');
            });

        const deliveryOfWagon: DeliveryOfWagon = this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd);
        this.memoOfDispatch.deliveryOfWagonList.push(deliveryOfWagon);
        this.suitableDeliveries = this.suitableDeliveries.filter(delivery => delivery.deliveryId !== this.deliveryIdToAdd);
    }

    removeDeliveryFromMemo(deliveryId): void {
        this.delMemoSub = this.deliveryService.removeMemoOfDispatch(deliveryId).subscribe(() => {
        }, () => {
            this.alert.danger('Ошибка при откреплении общей подачи от памятки');
        }, () => {
            this.suitableDeliveries.push(this.memoOfDispatch.deliveryOfWagonList.find(delivery => delivery.deliveryId === deliveryId));
            this.memoOfDispatch.deliveryOfWagonList = this.memoOfDispatch.deliveryOfWagonList
                .filter(delivery => delivery.deliveryId !== deliveryId);
            this.alert.success('Общая подача убрана из памятки');
        });
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
                this.memoOfDispatch.deliveryOfWagonList = this.memoOfDispatch.deliveryOfWagonList.concat(this.suitableDeliveries);
                this.suitableDeliveries = [];
            });
    }

    removeAllDeliveryOfWagonFromMemo(): void {
        const deliveryIds = this.memoOfDispatch.deliveryOfWagonList.map(delivery => delivery.deliveryId);
        this.delMemoSub = this.deliveryService.removeMemoOfDispatchFromAllDelivery(deliveryIds).subscribe(() => {
            this.loadSuitableDeliveries(this.memoOfDispatchId);
            this.memoOfDispatch.deliveryOfWagonList = [];
        }, () => {
            this.alert.danger('Ошибка при откреплении вагонов от памятки');
        }, () => {
            this.alert.success('Все вагоны убраны из памятки');
        });
    }

    checkWeight(): void {
        if (this.editedDelivery.cargoWeight > 200) {
            this.editedDelivery.cargoWeight = null;
        }
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.memoSub,
            this.createSub,
            this.updateSub,
            this.addMemoSub,
            this.addMemoToListSub,
            this.suitableDeliverySub
        ]);
    }

    applyWeightForAllDeliveries(): void {
        if (this.weightForAll < 0 || this.weightForAll > 999) {
            this.alert.warning('Вес указан некорректно');
            return;
        }
        for (const delivery of this.memoOfDispatch.deliveryOfWagonList) {
            delivery.cargoWeight = this.weightForAll;
        }
        this.saveAllDeliveries();
    }

    distributeShuntingToAllDeliveries(): void {
        let time = this.memoOfDispatch.deliveryOfWagonList.length;
        if (this.shuntingForAll > time) {
            this.alert.warning('Время превышает количество, будет распределено ' + time + ' часов');
            this.shuntingForAll = time;
        } else {
            time = this.shuntingForAll;
        }
        for (const delivery of this.memoOfDispatch.deliveryOfWagonList) {
            if (time > 0) {
                delivery.shuntingWorks = time > 0.5 ? 1 : 0.5;
            } else {
                delivery.shuntingWorks = 0;
            }
            time--;
        }
        this.saveAllDeliveries();
    }

    setRemove(deliveryId: number): void {
        this.deliveryIdToRemove = deliveryId;
    }

    unsetRemove(): void {
        this.deliveryIdToRemove = null;
    }
}
