import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeliveryOfWagon, StatementWithRate} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {UtilsService} from '../../shared/service/utils.service';
import {StatementService} from '../statement.service';
import {AuthService} from '../../admin/shared/services/auth.service';
import {SettingService} from '../../reference/service/setting.service';

@Component({
    selector: 'app-print-form-work-order-calculation',
    templateUrl: './print-form-work-order-calculation.component.html',
    styleUrls: ['./print-form-work-order-calculation.component.scss']
})
export class PrintFormWorkOrderCalculationComponent implements OnInit, OnDestroy {

    statementId: number;
    statement: StatementWithRate;
    companyFullName: string;
    private settingSub: Subscription;
    private memoSub: Subscription;
    deliveryList: DeliveryOfWagon[] = [];
    pages: number[];
    rowsOnPage = 65;
    sumWeight = 0;
    totalCost = 0;
    private statementSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private settingService: SettingService,
        private utils: UtilsService,
        private statementService: StatementService
    ) {
    }

    ngOnInit(): void {
        this.settingSub = this.settingService.getByType(['companyFullName']).subscribe(data => {
            this.companyFullName = data[0];
        });

        this.statementSub = this.route.params.pipe(
            switchMap((params: Params) => {
                if (params.statementId) {
                    this.statementId = params.statementId;
                    return this.statementService.getById(params.statementId);
                }
            }))
            .subscribe(statement => {
                this.statement = statement;
                // this.deliveryList = this.utils.calculateDeliveries(statement.statement, statement.rate);
                for (const memo of this.statement.statement.memoOfDispatchList) {
                    this.deliveryList = this.deliveryList.concat(memo.deliveryOfWagonList.filter(delivery => {
                        return delivery.loadUnloadWork;
                    }));
                }
                this.deliveryList.map(delivery => {
                    this.sumWeight += delivery.cargoWeight;
                });
                const count = Math.ceil(this.deliveryList.length / this.rowsOnPage);
                this.pages = Array.from({length: count}, (v, k) => k++);
            }, error => {
                throwError(error);
            });
    }

    public calculateTotal(): void {
        this.totalCost = 0;
        this.deliveryList.map(delivery => {
            this.totalCost += delivery.cargoWeight * this.statement.rate.loadUnloadTariff.tariff;
        });
        // this.totalCost = +this.totalCost.toFixed(0);
    }

    print(): void {
        window.print();
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.memoSub,
            this.settingSub
        ]);
    }
}
