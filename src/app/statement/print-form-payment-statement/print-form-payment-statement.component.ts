import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeliveryOfWagon, StatementWithRate} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {UtilsService} from '../../shared/service/utils.service';
import {StatementService} from '../statement.service';

@Component({
    selector: 'app-print-form-payment-statement',
    templateUrl: './print-form-payment-statement.component.html',
    styleUrls: ['./print-form-payment-statement.component.scss']
})
export class PrintFormPaymentStatementComponent implements OnInit, OnDestroy {

    statementId: number;
    statement: StatementWithRate;
    private memoSub: Subscription;
    deliveryList: DeliveryOfWagon[] = [];
    pages: number[];
    rowsOnPage = 30;
    sumWeight = 0;
    totalCost = 0;
    totalPaySum = 0;
    private statementSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private utils: UtilsService,
        private memoOfDeliveryService: StatementService
    ) {
    }

    ngOnInit(): void {
        this.statementSub = this.route.params.pipe(
            switchMap((params: Params) => {
                if (params['statementId']) {
                    this.statementId = params['statementId'];
                    return this.memoOfDeliveryService.getById(params['statementId']);
                }
            }))
            .subscribe(statement => {
                this.statement = statement;
                this.deliveryList = this.utils.calculateDeliveries(statement.statement, statement.rate);
                // for (const memo of this.statement.statement.memoOfDispatchList) {
                //   this.deliveryList = this.deliveryList.concat(memo.deliveryOfWagonList);
                // }
                this.deliveryList.map(delivery => {
                    this.sumWeight += delivery.cargoWeight;
                });
                const count = Math.ceil(this.deliveryList.length / this.rowsOnPage);
                this.pages = Array.from({length: count}, (v, k) => k++);
            }, error => {
                throwError(error);
            });
    }

    public getTotalCost(): void {
        this.totalCost = 0;
        this.totalPaySum = 0;
        this.deliveryList.map(delivery => {
            this.totalCost += delivery.calculation && delivery.calculation.totalSum ? delivery.calculation.totalSum : 0;
            this.totalPaySum += delivery.calculation && delivery.calculation.paySum ? delivery.calculation.paySum : 0;
        });
        this.totalCost = +this.totalCost.toFixed(0);
        // return this.totalCost;
    }

    print(): void {
        window.print();
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.memoSub
        ]);
    }
}
