import {Component, OnDestroy, OnInit} from '@angular/core';
import {Customer} from '../../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {CustomerService} from '../../service/customer.service';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
    selector: 'app-customer',
    templateUrl: './list-customer.component.html',
    styleUrls: ['./list-customer.component.scss']
})
export class ListCustomerComponent implements OnInit, OnDestroy {

    customers: Customer[] = [];
    customerIdToDelete: number;
    customersSub: Subscription;
    delSub: Subscription;

    constructor(private customerService: CustomerService,
                public router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.customersSub = this.customerService.getAll().subscribe(customers => {
            this.customers = customers;
        }, error => {
            throwError(error);
        });
    }

    delete(): void {
        this.delSub = this.customerService.delete(this.customerIdToDelete).subscribe((data) => {
            // this.alert.success(data.message);
            this.customers = this.customers.filter(customer => customer.customerId !== this.customerIdToDelete);
            this.unsetDelete();
        }, () => {
            this.alert.danger('Ошибка');
        }, () => {
            this.alert.success('Контрагент удален');
        });
    }

    setDelete(customerId: number): void {
        this.customerIdToDelete = customerId;
    }

    unsetDelete(): void {
        this.customerIdToDelete = null;
    }

    getById(customerId: number): number {
        if (customerId) {
            return this.customers.find(value => value.customerId === customerId).customerId;
        }
        return 0;
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.customersSub,
            this.delSub
        ]);
    }
}
