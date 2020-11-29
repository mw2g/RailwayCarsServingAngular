import {Component, OnDestroy, OnInit} from '@angular/core';
import {CargoOperation, Customer, MemoOfDelivery} from '../../shared/interfaces';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {UtilsService} from '../../shared/service/utils.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {CustomerService} from '../../reference/service/customer.service';

@Component({
  selector: 'app-list-memo-of-delivery',
  templateUrl: './list-memo-of-delivery.component.html',
  styleUrls: ['./list-memo-of-delivery.component.scss']
})
export class ListMemoOfDeliveryComponent implements OnInit, OnDestroy {

  memos: MemoOfDelivery[] = [];
  delSub: Subscription;
  memosSub: Subscription;
  cargoOperations: Observable<Array<CargoOperation>>;
  customers: Observable<Array<Customer>>;
  sortById = true;
  sortByDate: boolean;
  sortByWagonQuantity: boolean;
  searchStr = '';
  cargoOperationFilter = '';
  customerFilter = '';

  beforeDate: Date = new Date();
  afterDate: Date = new Date();

  constructor(private memoService: MemoOfDeliveryService,
              public router: Router,
              private alert: AlertService,
              private utils: UtilsService,
              private cargoOperationService: CargoOperationService,
              private customerService: CustomerService
  ) {
  }

  ngOnInit(): void {
    this.customers = this.customerService.getAll();
    this.cargoOperations = this.cargoOperationService.getAll();
    this.afterDate.setFullYear(this.afterDate.getFullYear() - 1);
    this.afterDate.setDate(this.afterDate.getDay() - 5);
    this.loadMemos();
  }

  sortListById(): void {
    this.sortByWagonQuantity = null;
    this.sortByDate = null;
    if (this.sortById) {
      this.memos = [...this.memos.sort((a, b) => a.memoOfDeliveryId < b.memoOfDeliveryId ? 1 : -1)];
      this.sortById = false;
    } else {
      this.memos = [...this.memos.sort((a, b) => a.memoOfDeliveryId > b.memoOfDeliveryId ? 1 : -1)];
      this.sortById = true;
    }
  }

  sortListByDate(): void {
    this.sortById = null;
    this.sortByWagonQuantity = null;
    if (this.sortByDate) {
      this.memos = [...this.memos.sort((a, b) => a.startDate < b.startDate ? 1 : -1)];
      this.sortByDate = false;
    } else {
      this.memos = [...this.memos.sort((a, b) => a.startDate > b.startDate ? 1 : -1)];
      this.sortByDate = true;
    }
  }

  sortListByWagonQuantity(): void {
    this.sortById = null;
    this.sortByDate = null;
    if (this.sortByWagonQuantity) {
      this.memos = [...this.memos.sort((a, b) => a.deliveryOfWagonList.length < b.deliveryOfWagonList.length ? 1 : -1)];
      this.sortByWagonQuantity = false;
    } else {
      this.memos = [...this.memos.sort((a, b) => a.deliveryOfWagonList.length > b.deliveryOfWagonList.length ? 1 : -1)];
      this.sortByWagonQuantity = true;
    }
  }

  loadMemos(): void {
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
    this.memosSub = this.memoService.getAllMemos(this.afterDate, this.beforeDate).subscribe(memos => {
      this.memos = memos;
    }, error => {
      throwError(error);
    });
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.memosSub,
      this.delSub
    ]);
  }
}
