import {Component, OnDestroy, OnInit} from '@angular/core';
import {CargoOperation, Customer, DeliveryOfWagon} from '../../shared/interfaces';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {DeliveryOfWagonService} from '../delivery-of-wagon.service';
import {UtilsService} from '../../shared/service/utils.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {CustomerService} from '../../reference/service/customer.service';

@Component({
  selector: 'app-delivery-of-wagon',
  templateUrl: './list-delivery-of-wagon.component.html',
  styleUrls: ['./list-delivery-of-wagon.component.scss']
})
export class ListDeliveryOfWagonComponent implements OnInit, OnDestroy {

  deliveries: DeliveryOfWagon[] = [];
  deliveryIdToDelete: number;
  deliveriesSub: Subscription;
  delSub: Subscription;
  cargoOperations: Observable<Array<CargoOperation>>;
  customers: Observable<Array<Customer>>;
  sortByStartDate: boolean;
  sortByEndDate: boolean;
  sortByWagon: boolean;
  sortById = true;
  searchStr = '';
  cargoOperationFilter = '';
  customerFilter = '';
  loadUnloadWorkFilter = '';

  beforeDate: Date = new Date();
  afterDate: Date = new Date();

  // afterDate: Date = new Date(this.beforeDate.getMilliseconds() - new Date(0, 1).getDate());

  constructor(private deliveryService: DeliveryOfWagonService,
              public router: Router,
              private alert: AlertService,
              private utils: UtilsService,
              private cargoOperationService: CargoOperationService,
              private customerService: CustomerService
  ) {
  }

  sortListByStartDate(): void {
    this.sortByEndDate = null;
    this.sortById = null;
    this.sortByWagon = null;
    if (this.sortByStartDate) {
      this.deliveries = [...this.deliveries.sort((a, b) => a.startDate < b.startDate ? 1 : -1)];
      this.sortByStartDate = false;
    } else {
      this.deliveries = [...this.deliveries.sort((a, b) => a.startDate > b.startDate ? 1 : -1)];
      this.sortByStartDate = true;
    }
  }

  sortListByEndDate(): void {
    this.sortByStartDate = null;
    this.sortByWagon = null;
    this.sortById = null;
    if (this.sortByEndDate) {
      this.deliveries = [...this.deliveries.sort((a, b) => a.endDate < b.endDate ? 1 : -1)];
      this.sortByEndDate = false;
    } else {
      this.deliveries = [...this.deliveries.sort((a, b) => a.endDate > b.endDate ? 1 : -1)];
      this.sortByEndDate = true;
    }
  }

  sortListById(): void {
    this.sortByStartDate = null;
    this.sortByEndDate = null;
    this.sortByWagon = null;
    if (this.sortById) {
      this.deliveries = [...this.deliveries.sort((a, b) => a.deliveryId < b.deliveryId ? 1 : -1)];
      this.sortById = false;
    } else {
      this.deliveries = [...this.deliveries.sort((a, b) => a.deliveryId > b.deliveryId ? 1 : -1)];
      this.sortById = true;
    }
  }

  sortListByWagon(): void {
    this.sortByStartDate = null;
    this.sortByEndDate = null;
    this.sortById = null;
    if (this.sortByWagon) {
      this.deliveries = [...this.deliveries.sort((a, b) => a.wagon < b.wagon ? 1 : -1)];
      this.sortByWagon = false;
    } else {
      this.deliveries = [...this.deliveries.sort((a, b) => a.wagon > b.wagon ? 1 : -1)];
      this.sortByWagon = true;
    }
  }

  ngOnInit(): void {
    this.customers = this.customerService.getAll();
    this.cargoOperations = this.cargoOperationService.getAll();
    this.afterDate.setFullYear(this.afterDate.getFullYear() - 1);
    this.afterDate.setDate(this.afterDate.getDay() - 5);
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    if (this.afterDate) {
      this.afterDate = new Date(this.afterDate);
    } else {
      this.afterDate = new Date(2019, 0);
    }
    if (this.beforeDate) {
      this.beforeDate = new Date(this.beforeDate);
    } else {
      this.beforeDate = new Date();
    }
    this.deliveriesSub = this.deliveryService.getAllDeliveries(this.afterDate, this.beforeDate).subscribe(deliveries => {
      this.deliveries = deliveries;
    }, error => {
      throwError(error);
    });
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

  getWagonNumberById(deliveryId: number): string {
    if (deliveryId) {
      return this.deliveries.find(value => value.deliveryId === deliveryId).wagon;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.deliveriesSub,
      this.delSub
    ]);
  }
}
