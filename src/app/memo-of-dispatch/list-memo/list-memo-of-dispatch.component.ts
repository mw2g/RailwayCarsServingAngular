import {Component, OnDestroy, OnInit} from '@angular/core';
import {CargoOperation, MemoOfDispatch, Customer} from '../../shared/interfaces';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {MemoOfDispatchService} from '../memo-of-dispatch.service';
import {UtilsService} from '../../shared/service/utils.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {CustomerService} from '../../reference/service/customer.service';

@Component({
  selector: 'app-list-statement',
  templateUrl: './list-memo-of-dispatch.component.html',
  styleUrls: ['./list-memo-of-dispatch.component.scss']
})
export class ListMemoOfDispatchComponent implements OnInit, OnDestroy {

  memos: MemoOfDispatch[] = [];
  memoIdToDelete: number;
  memosSub: Subscription;
  delSub: Subscription;
  cargoOperations: Observable<Array<CargoOperation>>;
  customers: Observable<Array<Customer>>;
  sortById = true;
  sortByWagonQuantity: boolean;
  sortByDate: boolean;
  searchStr = '';
  cargoOperationFilter = '';
  customerFilter = '';

  beforeDate: Date = new Date();
  afterDate: Date = new Date();

  constructor(private memoService: MemoOfDispatchService,
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
      this.memos = [...this.memos.sort((a, b) => a.memoOfDispatchId < b.memoOfDispatchId ? 1 : -1)];
      this.sortById = false;
    } else {
      this.memos = [...this.memos.sort((a, b) => a.memoOfDispatchId > b.memoOfDispatchId ? 1 : -1)];
      this.sortById = true;
    }
  }

  sortListByDate(): void {
    this.sortByWagonQuantity = null;
    this.sortById = null;
    if (this.sortByDate) {
      this.memos = [...this.memos.sort((a, b) => a.endDate < b.endDate ? 1 : -1)];
      this.sortByDate = false;
    } else {
      this.memos = [...this.memos.sort((a, b) => a.endDate > b.endDate ? 1 : -1)];
      this.sortByDate = true;
    }
  }

  sortListByWagonQuantity(): void {
    this.sortByDate = null;
    this.sortById = null;
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

  getById(memoId: number): number {
    if (memoId) {
      return this.memos.find(value => value.memoOfDispatchId === memoId).memoOfDispatchId;
    }
    return 0;
  }

  setDelete(memoId: number): void {
    this.memoIdToDelete = memoId;
  }

  unsetDelete(): void {
    this.memoIdToDelete = null;
  }

  delete(): void {
    this.delSub = this.memoService.delete(this.memoIdToDelete).subscribe((data) => {
      this.alert.success(data.message);
      this.memos = this.memos.filter(memo => memo.memoOfDispatchId !== this.memoIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Пользователь удален');
    });
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.memosSub,
      this.delSub
    ]);
  }
}
