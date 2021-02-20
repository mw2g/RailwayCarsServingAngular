import {Component, OnDestroy, OnInit} from '@angular/core';
import {CargoOperation, Customer, DeliveryOfWagon} from '../../shared/interfaces';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {DeliveryOfWagonService} from '../delivery-of-wagon.service';
import {UtilsService} from '../../shared/service/utils.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {CustomerService} from '../../reference/service/customer.service';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
    selector: 'app-delivery-of-wagon',
    templateUrl: './list-delivery-of-wagon.component.html',
    styleUrls: ['./list-delivery-of-wagon.component.scss']
})
export class ListDeliveryOfWagonComponent implements OnInit, OnDestroy {

    deliveries: DeliveryOfWagon[] = [];
    deliveriesSub: Subscription;
    cargoOperations: Observable<Array<CargoOperation>>;
    customers: Observable<Array<Customer>>;
    sortState = {deliveryId: null, wagon: null, startDate: false, endDate: null, cargoWeight: null};
    searchStr = '';
    customerFilter = '';
    cargoOperationFilter = '';
    loadUnloadWorkFilter = '';

    beforeDate: Date;
    afterDate: Date;

    constructor(private deliveryService: DeliveryOfWagonService,
                public router: Router,
                private alert: AlertService,
                private utils: UtilsService,
                private cargoOperationService: CargoOperationService,
                private localStorage: LocalStorageService,
                private customerService: CustomerService
    ) {
    }

    ngOnInit(): void {
        const deliveryListViewSettings = JSON.parse(localStorage.getItem('deliveryListViewSettings'));
        if (deliveryListViewSettings) {
            this.sortState = deliveryListViewSettings.sortState ? deliveryListViewSettings.sortState : this.sortState;
            this.searchStr = deliveryListViewSettings.searchStr ? deliveryListViewSettings.searchStr : '';
            this.customerFilter = deliveryListViewSettings.customerFilter ? deliveryListViewSettings.customerFilter : '';
            this.cargoOperationFilter = deliveryListViewSettings.cargoOperationFilter ? deliveryListViewSettings.cargoOperationFilter : '';
            this.loadUnloadWorkFilter = deliveryListViewSettings.loadUnloadWorkFilter ? deliveryListViewSettings.loadUnloadWorkFilter : '';
            this.afterDate = deliveryListViewSettings.afterDate ? deliveryListViewSettings.afterDate : this.afterDate;
            // this.beforeDate = deliveryListViewSettings.beforeDate ? deliveryListViewSettings.beforeDate : this.beforeDate;
        }

        this.customers = this.customerService.getAll();
        this.cargoOperations = this.cargoOperationService.getAll();
        this.loadDeliveries();
    }

    loadDeliveries(): void {
        this.afterDate = this.utils.prepareDate(this.afterDate, new Date(new Date().getFullYear(), new Date().getMonth() - 1));
        this.beforeDate = this.utils.prepareDate(this.beforeDate, new Date());

        this.deliveriesSub = this.deliveryService.getAll(this.afterDate, this.beforeDate).subscribe(deliveries => {
            this.deliveries = deliveries;
            for (const key of Object.keys(this.sortState)) {
                if (this.sortState[key] != null) {
                    this.sortList(key, true);
                    return;
                }
            }
        }, error => {
            throwError(error);
        });
        this.saveViewSettings();
    }

    sortList(field: string, fromMemory?): void {
        if (!fromMemory) {
            for (const key of Object.keys(this.sortState)) {
                this.sortState[key] = key === field ? !this.sortState[key] : null;
            }
        }
        const reverse = this.sortState[field] ? 1 : -1;
        this.deliveries = [...this.deliveries.sort((a, b) => {
            return a = a[field], b = b[field], reverse * (a > b ? 1 : -1);
        })];
    }

    clearViewSettings(): void {
        localStorage.removeItem('deliveryListViewSettings');
        this.sortState = {deliveryId: null, wagon: null, startDate: false, endDate: null, cargoWeight: null};
        this.searchStr = '';
        this.customerFilter = '';
        this.cargoOperationFilter = '';
        this.loadUnloadWorkFilter = '';
        this.afterDate = new Date();
        this.afterDate.setFullYear(this.afterDate.getFullYear(), new Date().getMonth() - 1);
        this.beforeDate = new Date();

        this.loadDeliveries();
    }

    ngOnDestroy(): void {
        this.saveViewSettings();

        this.utils.unsubscribe([
            this.deliveriesSub
        ]);
    }

    private saveViewSettings(): void {
        const deliveryListViewSettings = {
            sortState: this.sortState,
            searchStr: this.searchStr,
            customerFilter: this.customerFilter,
            cargoOperationFilter: this.cargoOperationFilter,
            loadUnloadWorkFilter: this.loadUnloadWorkFilter,
            afterDate: this.afterDate,
            beforeDate: this.beforeDate
        };
        localStorage.setItem('deliveryListViewSettings', JSON.stringify(deliveryListViewSettings));
    }
}
