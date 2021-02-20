import {Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CargoType, DeliveryOfWagon, MemoOfDelivery, Owner, WagonType} from '../../shared/interfaces';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';
import {WagonTypeService} from '../../reference/service/wagon-type.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UtilsService} from '../../shared/service/utils.service';
import {CargoTypeService} from '../../reference/service/cargo-type.service';

@Component({
    selector: 'app-list-delivery-in-memo-of-delivery',
    templateUrl: './list-delivery-in-memo-of-delivery.component.html',
    styleUrls: ['./list-delivery-in-memo-of-delivery.component.scss']
})
export class ListDeliveryInMemoOfDeliveryComponent implements OnInit, OnDestroy {

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    @Input() memoOfDeliveryId: number;
    @Input() memoOfDelivery: MemoOfDelivery;
    @Input() enableForm;

    suitableDeliveries: Array<DeliveryOfWagon> = [];
    deliveryIdToDelete: number;
    deliveryIdToAdd: number;
    weightFocus = false;
    public editedDelivery: DeliveryOfWagon;
    private isNewRecord: boolean;

    private createSub: Subscription;
    private updateSub: Subscription;
    private memoSub: Subscription;
    private delSub: Subscription;
    private suitableDeliverySub: Subscription;
    private addMemoToListSub: Subscription;
    private addMemoSub: Subscription;
    private delMemoSub: Subscription;
    private autocompleteSub: Subscription;

    private ownersList: Observable<Array<Owner>>;
    private wagonTypeList: Observable<Array<WagonType>>;
    private cargoTypeList: Observable<Array<CargoType>>;

    constructor(private deliveryService: DeliveryOfWagonService,
                private customerService: CustomerService,
                private wagonTypeService: WagonTypeService,
                private memoOfDeliveryService: MemoOfDeliveryService,
                private deliveryOfWagonService: DeliveryOfWagonService,
                private cargoTypeService: CargoTypeService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    @HostListener('window:keydown.insert', ['$event'])
    showPinned(event: KeyboardEvent): void {
        event.preventDefault();
        // console.log(event);
        if (this.enableForm) {
            this.weightFocus = false;
            this.addDelivery();
        }
    }

    ngOnInit(): void {
        this.wagonTypeList = this.wagonTypeService.getAll();
        this.cargoTypeList = this.cargoTypeService.getAll();
        this.ownersList = this.deliveryOfWagonService.getAllOwners();

        this.loadSuitableDeliveries(this.memoOfDeliveryId);
    }

    public loadSuitableDeliveries(memoId: number): void {
        this.suitableDeliverySub = this.deliveryService.getSuitableDeliveriesForMemoOfDelivery(memoId).subscribe(deliveries => {
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
        let deliveryToClone: DeliveryOfWagon;
        if (this.memoOfDelivery.deliveryOfWagonList.length > 0) {
            deliveryToClone = this.memoOfDelivery.deliveryOfWagonList[this.memoOfDelivery.deliveryOfWagonList.length - 1];
        }
        this.editedDelivery = {
            deliveryId: 0,
            wagon: '',
            wagonType: deliveryToClone ? deliveryToClone.wagonType : '',
            cargoType: deliveryToClone ? deliveryToClone.cargoType : '',
            owner: deliveryToClone ? deliveryToClone.owner : '',
            memoOfDelivery: this.memoOfDelivery.memoOfDeliveryId,
            startDate: this.memoOfDelivery.startDate,
            customer: this.memoOfDelivery.customer.customerName,
            cargoOperation: this.memoOfDelivery.cargoOperation,
            loadUnloadWork: this.memoOfDelivery.cargoOperation === 'ВЫГРУЗКА' && this.memoOfDelivery.customer.customerName.includes('ИСКИТИМЦЕМЕНТ')
        };
        this.memoOfDelivery.deliveryOfWagonList.push(this.editedDelivery);
        this.isNewRecord = true;
        this.enableForm = false;
    }

    // редактирование
    editDelivery(delivery: DeliveryOfWagon, focus?: string): void {
        this.weightFocus = focus === 'weight' ? true : false;
        this.isNewRecord = false;
        this.editedDelivery = {
            ...delivery
        };
    }

    // editDeliveryWagonFocus(delivery: DeliveryOfWagon): void {
    //     this.weightFocus = false;
    //     this.editDelivery(delivery);
    // }
    //
    // editWeight(delivery: DeliveryOfWagon): void {
    //     this.weightFocus = true;
    //     this.editDelivery(delivery);
    // }

    // отмена редактирования
    cancel(): void {
        // если отмена при добавлении, удаляем последнюю запись
        if (this.isNewRecord) {
            this.memoOfDelivery.deliveryOfWagonList.pop();
            this.isNewRecord = false;
        }
        this.editedDelivery = null;
        this.enableForm = true;
    }

    // сохраняем
    saveDelivery(editNext?): void {
        const deliveryId = this.editedDelivery.deliveryId;
        this.editedDelivery.endDate = this.prepareDate(this.editedDelivery.endDate);
        if (this.isNewRecord) {
            // добавляем
            this.createSub = this.deliveryService.create(this.editedDelivery).subscribe((data) => {
                this.editedDelivery.deliveryId = data.deliveryId;
            }, (error) => {
                if (error instanceof HttpErrorResponse
                    && error.status === 423) {
                    this.alert.danger('Подача с таким номером вагона и датой подачи уже существует');
                } else {
                    this.alert.danger('Ошибка');
                }
                this.memoOfDelivery.deliveryOfWagonList.pop();
            }, () => {
                this.alert.success('Общая подача создана');
                this.editedDelivery = null;
            });
            this.isNewRecord = false;
            this.enableForm = true;
        } else {
            // изменяем
            this.updateSub = this.deliveryService.update(this.editedDelivery).subscribe((data) => {
                this.memoOfDelivery.deliveryOfWagonList.map(delivery => {
                    if (delivery.deliveryId === this.editedDelivery.deliveryId) {
                        delivery.wagon = data.wagon;
                        delivery.wagonType = data.wagonType;
                        delivery.cargoType = data.cargoType;
                        delivery.owner = data.owner;
                        delivery.endDate = data.endDate;
                        delivery.cargoWeight = data.cargoWeight;
                        delivery.loadUnloadWork = data.loadUnloadWork;
                    }
                });
            }, (error) => {
                if (error instanceof HttpErrorResponse
                    && error.status === 423) {
                    this.alert.danger('Подача с таким номером вагона и датой подачи уже существует');
                } else {
                    this.alert.danger('Ошибка');
                }
            }, () => {
                this.alert.success('Общая подача сохранена');
                this.editedDelivery = null;
                this.enableForm = true;
                if (editNext) {
                    let next = false;
                    for (const delivery of this.memoOfDelivery.deliveryOfWagonList.values()) {
                        if (next) {
                            this.editDelivery(delivery, editNext);
                            break;
                        }
                        next = delivery.deliveryId === deliveryId ? true : false;
                    }
                }
            });
        }
    }

    autocomplete(): void {
        if (this.memoOfDelivery.deliveryOfWagonList.length < 2
            && this.editedDelivery.wagon.length === 8) {
            this.autocompleteSub = this.deliveryOfWagonService.getDeliveryForAutocomplete(this.editedDelivery.wagon).subscribe(data => {
                if (data.wagon) {
                    // this.editedDelivery.customer = data.customer;
                    this.editedDelivery.owner = data.owner;
                    this.editedDelivery.wagonType = data.wagonType;
                    this.editedDelivery.cargoType = data.cargoType;
                }
            });
        }
    }

    prepareDate(date: Date): Date {
        return date ? new Date(date) : date;
    }

    delete(): void {
        this.delSub = this.deliveryService.delete(this.deliveryIdToDelete).subscribe(() => {
            this.memoOfDelivery.deliveryOfWagonList = this.memoOfDelivery.deliveryOfWagonList
                .filter(delivery => delivery.deliveryId !== this.deliveryIdToDelete);
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
            return this.memoOfDelivery.deliveryOfWagonList.find(value => value.deliveryId === deliveryId).deliveryId;
        }
        return 0;
    }

    addDeliveryById(): void {
        if (!this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd)) {
            this.alert.warning('Нет подходящей подачи с таким номером');
            this.deliveryIdToAdd = null;
            return;
        }
        this.addMemoSub = this.deliveryService.addMemoOfDelivery(this.deliveryIdToAdd.toString(), String(this.memoOfDeliveryId))
            .subscribe(() => {
            }, () => {
                this.alert.danger('Ошибка при добавлении общей подачи по номеру');
            }, () => {
                this.memoOfDelivery.deliveryOfWagonList
                    .find(delivery => delivery.deliveryId === this.deliveryIdToAdd).memoOfDelivery = this.memoOfDeliveryId;
                this.deliveryIdToAdd = null;
                this.alert.success('В общую подачу добавлена памятка подачи');
            });

        const deliveryOfWagon: DeliveryOfWagon = this.suitableDeliveries.find(delivery => delivery.deliveryId === this.deliveryIdToAdd);
        this.memoOfDelivery.deliveryOfWagonList.push(deliveryOfWagon);
        this.suitableDeliveries = this.suitableDeliveries.filter(delivery => delivery.deliveryId !== this.deliveryIdToAdd);
    }

    removeMemoFromDelivery(deliveryId): void {
        this.delMemoSub = this.deliveryService.removeMemoOfDelivery(deliveryId).subscribe(() => {
        }, () => {
            this.alert.danger('Ошибка при откреплении общей подачи от памятки');
        }, () => {
            this.suitableDeliveries.push(this.memoOfDelivery.deliveryOfWagonList.find(delivery => delivery.deliveryId === deliveryId));
            this.memoOfDelivery.deliveryOfWagonList = this.memoOfDelivery.deliveryOfWagonList
                .filter(delivery => delivery.deliveryId !== deliveryId);
            this.alert.success('Общая подача убрана из памятки');
        });
        this.unsetDelete();
    }

    addAllSuitableDeliveries(): void {
        this.deliveryIdToAdd = null;
        this.addMemoToListSub = this.deliveryService
            .addMemoOfDeliveryToDeliveryList(this.suitableDeliveries.map(delivery => delivery.deliveryId), this.memoOfDeliveryId)
            .subscribe(() => {
            }, () => {
                this.alert.danger('Ошибка при добавлении всех подходящих памяток');
            }, () => {
                this.memoOfDelivery.deliveryOfWagonList = this.memoOfDelivery.deliveryOfWagonList.concat(this.suitableDeliveries);
                this.memoOfDelivery.deliveryOfWagonList.map(delivery => delivery.memoOfDelivery = this.memoOfDeliveryId);
                this.alert.success('Все подходящие подачи добавлены');
                this.suitableDeliveries = [];
            });

    }

    removeAllDeliveryOfWagonFromMemo(): void {
        const deliveryIds = this.memoOfDelivery.deliveryOfWagonList.map(delivery => delivery.deliveryId);
        this.delSub = this.deliveryService.removeMemoOfDeliveryFromAllDelivery(deliveryIds).subscribe((data) => {
            // this.alert.success(data.message);
            this.loadSuitableDeliveries(this.memoOfDeliveryId);
            this.memoOfDelivery.deliveryOfWagonList = [];
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
            this.delSub,
            this.addMemoSub,
            this.delMemoSub,
            this.addMemoToListSub,
            this.suitableDeliverySub,
            this.autocompleteSub
        ]);
    }
}
