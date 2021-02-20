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
    memosSub: Subscription;
    cargoOperations: Observable<Array<CargoOperation>>;
    customers: Observable<Array<Customer>>;
    sortState = {memoOfDeliveryId: null, startDate: false, wagonQuantity: null};
    searchStr = '';
    cargoOperationFilter = '';
    customerFilter = '';

    afterDate: Date;
    beforeDate: Date;

    constructor(private memoService: MemoOfDeliveryService,
                public router: Router,
                private alert: AlertService,
                private utils: UtilsService,
                private cargoOperationService: CargoOperationService,
                private customerService: CustomerService
    ) {
    }

    ngOnInit(): void {
        const memoOfDeliveryViewSettings = JSON.parse(localStorage.getItem('memoOfDeliveryViewSettings'));
        if (memoOfDeliveryViewSettings) {
            this.sortState = memoOfDeliveryViewSettings.sortState ? memoOfDeliveryViewSettings.sortState : this.sortState;
            this.searchStr = memoOfDeliveryViewSettings.searchStr ? memoOfDeliveryViewSettings.searchStr : '';
            this.customerFilter = memoOfDeliveryViewSettings.customerFilter ? memoOfDeliveryViewSettings.customerFilter : '';
            this.cargoOperationFilter = memoOfDeliveryViewSettings.cargoOperationFilter ? memoOfDeliveryViewSettings.cargoOperationFilter : '';
            this.afterDate = memoOfDeliveryViewSettings.afterDate ? memoOfDeliveryViewSettings.afterDate : this.afterDate;
            // this.beforeDate = memoOfDeliveryViewSettings.beforeDate ? memoOfDeliveryViewSettings.beforeDate : this.beforeDate;
        }

        this.customers = this.customerService.getAll();
        this.cargoOperations = this.cargoOperationService.getAll();
        this.loadMemos();
    }

    loadMemos(): void {
        this.afterDate = this.utils.prepareDate(this.afterDate, new Date(new Date().getFullYear() - 1, new Date().getMonth() - 1));
        this.beforeDate = this.utils.prepareDate(this.beforeDate, new Date());

        this.memosSub = this.memoService.getAll(this.afterDate, this.beforeDate).subscribe(memos => {
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
        localStorage.removeItem('memoOfDeliveryViewSettings');
        this.sortState = {memoOfDeliveryId: null, startDate: false, wagonQuantity: null};
        this.searchStr = '';
        this.customerFilter = '';
        this.cargoOperationFilter = '';
        this.afterDate = new Date();
        this.afterDate.setFullYear(this.afterDate.getFullYear(), new Date().getMonth() - 1);
        this.beforeDate = new Date();

        this.loadMemos();
    }

    ngOnDestroy(): void {
        this.saveViewSettings();

        this.utils.unsubscribe([
            this.memosSub
        ]);
    }

    private saveViewSettings(): void {
        const memoOfDeliveryViewSettings = {
            sortState: this.sortState,
            searchStr: this.searchStr,
            customerFilter: this.customerFilter,
            cargoOperationFilter: this.cargoOperationFilter,
            afterDate: this.afterDate,
            beforeDate: this.beforeDate
        };
        localStorage.setItem('memoOfDeliveryViewSettings', JSON.stringify(memoOfDeliveryViewSettings));
    }
}
