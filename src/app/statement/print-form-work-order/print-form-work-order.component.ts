import {Component, OnDestroy, OnInit} from '@angular/core';
import {StatementService} from '../statement.service';
import {DeliveryOfWagon, MemoOfDispatch, Statement} from '../../shared/interfaces';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {UtilsService} from '../../shared/service/utils.service';
import {AuthService} from '../../admin/shared/services/auth.service';
import {SettingService} from '../../reference/service/setting.service';

@Component({
    selector: 'app-print-form-work-order',
    templateUrl: './print-form-work-order.component.html',
    styleUrls: ['./print-form-work-order.component.scss']
})
export class PrintFormWorkOrderComponent implements OnInit, OnDestroy {

    statementId: number;
    statement: Statement;
    sumWeight = 0;
    // sumShuntingWork = 0;
    deliveryList: DeliveryOfWagon[] = [];
    companyFullName: string;
    private settingSub: Subscription;
    private statementSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private utils: UtilsService,
        private authService: AuthService,
        private settingService: SettingService,
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
                this.statement = statement.statement;
                // for (const memo of this.statement.memoOfDispatchList) {
                //     this.deliveryList = this.deliveryList.concat(memo.deliveryOfWagonList);
                // }
                this.statement.memoOfDispatchList
                    .map(memo => memo.deliveryOfWagonList = memo.deliveryOfWagonList.filter(delivery => delivery.loadUnloadWork));
                this.statement.memoOfDispatchList = this.statement.memoOfDispatchList.filter(memo => memo.deliveryOfWagonList.length > 0);

                for (const memo of this.statement.memoOfDispatchList) {
                    this.deliveryList = this.deliveryList.concat(memo.deliveryOfWagonList);
                }
                this.deliveryList.map(delivery => {
                    this.sumWeight += delivery.cargoWeight;
                    // this.sumShuntingWork = this.sumShuntingWork += delivery.shuntingWorks;
                });
            }, error => {
                throwError(error);
            });
    }

    print(): void {
        window.print();
    }

    calcMemoWeight(memo: MemoOfDispatch): number {
        let sumWeight = 0;
        for (const delivery of memo.deliveryOfWagonList) {
            sumWeight += delivery.cargoWeight ? delivery.cargoWeight : 0;
        }
        return sumWeight;
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.statementSub,
            this.settingSub
        ]);
    }
}
