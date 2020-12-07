import {Component, OnDestroy, OnInit} from '@angular/core';
import {CargoOperation, Customer, MemoOfDelivery, MemoOfDispatch} from '../../shared/interfaces';
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
    memosSub: Subscription;
    cargoOperations: Observable<Array<CargoOperation>>;
    customers: Observable<Array<Customer>>;
    sortState = {memoOfDispatchId: null, endDate: true, wagonQuantity: null};
    searchStr = '';
    cargoOperationFilter = '';
    customerFilter = '';

    afterDate: Date;
    beforeDate: Date;

    constructor(private memoService: MemoOfDispatchService,
                public router: Router,
                private alert: AlertService,
                private utils: UtilsService,
                private cargoOperationService: CargoOperationService,
                private customerService: CustomerService
    ) {
    }

    ngOnInit(): void {
        const memoOfDispatchViewSettings = JSON.parse(localStorage.getItem('memoOfDispatchViewSettings'));
        if (memoOfDispatchViewSettings) {
            this.sortState = memoOfDispatchViewSettings.sortState ? memoOfDispatchViewSettings.sortState : this.sortState;
            this.searchStr = memoOfDispatchViewSettings.searchStr ? memoOfDispatchViewSettings.searchStr : '';
            this.customerFilter = memoOfDispatchViewSettings.customerFilter ? memoOfDispatchViewSettings.customerFilter : '';
            this.cargoOperationFilter = memoOfDispatchViewSettings.cargoOperationFilter ? memoOfDispatchViewSettings.cargoOperationFilter : '';
            this.afterDate = memoOfDispatchViewSettings.afterDate ? memoOfDispatchViewSettings.afterDate : this.afterDate;
            this.beforeDate = memoOfDispatchViewSettings.beforeDate ? memoOfDispatchViewSettings.beforeDate : this.beforeDate;
        }
        this.customers = this.customerService.getAll();
        this.cargoOperations = this.cargoOperationService.getAll();
        this.loadMemos();
    }

    sortList(field: string, primer?, fromMemo?): void {
        if (!fromMemo) {
            for (const key of Object.keys(this.sortState)) {
                this.sortState[key] = key === field ? !this.sortState[key] : null;
            }
        }
        const prep = primer ? (x) => primer(x) : (x) => x[field];
        const reverse = this.sortState[field] ? 1 : -1;
        this.memos = [...this.memos.sort((a, b) => {
            return a = prep(a), b = prep(b), reverse * (a > b ? 1 : -1);
        })];
    }

    public deliveryListLengthFunc = (memo: MemoOfDelivery): number => memo.deliveryOfWagonList.length;

    clearViewSettings(): void {
        localStorage.removeItem('memoOfDispatchViewSettings');
        this.sortState = {memoOfDispatchId: null, endDate: true, wagonQuantity: null};
        this.searchStr = '';
        this.customerFilter = '';
        this.cargoOperationFilter = '';
        this.afterDate = new Date();
        this.afterDate.setFullYear(this.afterDate.getFullYear() - 1);
        this.beforeDate = new Date();

        this.loadMemos();
    }

    loadMemos(): void {
        this.afterDate = this.utils.prepareDate(this.afterDate, new Date(new Date().getFullYear() - 1, new Date().getMonth() - 1));
        this.beforeDate = this.utils.prepareDate(this.beforeDate, new Date());

        this.memosSub = this.memoService.getAllMemos(this.afterDate, this.beforeDate).subscribe(memos => {
            this.memos = memos;
            for (const key of Object.keys(this.sortState)) {
                if (this.sortState[key] != null) {
                    this.sortList(key, key === 'wagonQuantity' ? this.deliveryListLengthFunc : null, true);
                    return;
                }
            }
        }, error => {
            throwError(error);
        });
        this.saveViewSettings();
    }

    ngOnDestroy(): void {
        this.saveViewSettings();

        this.utils.unsubscribe([
            this.memosSub
        ]);
    }

    private saveViewSettings() {
        const memoOfDispatchViewSettings = {
            sortState: this.sortState,
            searchStr: this.searchStr,
            customerFilter: this.customerFilter,
            cargoOperationFilter: this.cargoOperationFilter,
            afterDate: this.afterDate,
            beforeDate: this.beforeDate
        };
        localStorage.setItem('memoOfDispatchViewSettings', JSON.stringify(memoOfDispatchViewSettings));
    }
}
