import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DeliveryOfWagon, MemoOfDispatch, Statement, StatementRate} from '../../shared/interfaces';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {StatementService} from '../statement.service';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';
import {MemoOfDispatchService} from '../../memo-of-dispatch/memo-of-dispatch.service';
import {UtilsService} from '../../shared/service/utils.service';

@Component({
    selector: 'app-memo-in-statement',
    templateUrl: './list-memo-in-statement.component.html',
    styleUrls: ['./list-memo-in-statement.component.scss']
})
export class ListMemoInStatementComponent implements OnInit, OnDestroy {

    @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any>;
    @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

    @Input() statementId: number;
    @Input() memoList: MemoOfDispatch[] = [];
    @Input() statement: Statement;
    @Input() statementRate: StatementRate;
    @Input() enableForm;

    addMemoBar = true;
    deliveryList: DeliveryOfWagon[] = [];
    suitableMemos: MemoOfDispatch[] = [];
    memoIdToAdd: number;
    totalCost: number;
    searchStr = '';
    public editedMemo: MemoOfDispatch;

    private updateSub: Subscription;
    private createSub: Subscription;
    private removeMemoSub: Subscription;
    private suitableMemoSub: Subscription;
    private addListMemoSub: Subscription;
    private addMemoSub: Subscription;
    private baseRateAndPenaltySub: Subscription;
    private removeAllMemoSub: Subscription;

    constructor(private deliveryService: DeliveryOfWagonService,
                private memoOfDispatchService: MemoOfDispatchService,
                private customerService: CustomerService,
                private statementService: StatementService,
                private router: Router,
                private alert: AlertService,
                private utils: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.loadSuitableMemos(this.statementId);
    }

    public loadDeliveryList(): void {
        this.deliveryList = [];
        // for (const memo of this.memoList) {
        //   this.deliveryList = this.deliveryList.concat(memo.deliveryOfWagonList);
        // }
        this.deliveryList = this.utils.calculateDeliveries(this.statement, this.statementRate);
    }

    public getTotalCost(): number {
        this.totalCost = 0;
        this.deliveryList.map(delivery => {
            this.totalCost += delivery.calculation && delivery.calculation.totalSum ? delivery.calculation.totalSum : 0;
        });
        this.totalCost = +this.totalCost.toFixed(0);
        return this.totalCost;
    }

    // public calculateDeliveries(deliveryList: DeliveryOfWagon[]): DeliveryOfWagon[] {
    //   deliveryList.map(delivery => {
    //     const totalTime = (new Date(delivery.endDate).getTime() - new Date(delivery.startDate).getTime()) / 3600000;
    //     const exactCalculationTime = totalTime - this.statementRate.deliveryDispatchTimeNorm.norm;
    //     let calculationTime;
    //     if (exactCalculationTime > 0) {
    //       calculationTime = (exactCalculationTime % 1) >= 0.25 ? Math.ceil(exactCalculationTime) : Math.floor(exactCalculationTime);
    //     } else {
    //       calculationTime = 0;
    //     }
    //     const maxPayTime = this.statementRate.turnoverTimeNorm.norm - this.statementRate.deliveryDispatchTimeNorm.norm + 24;
    //     let payTime = calculationTime > maxPayTime ? maxPayTime : calculationTime;
    //     payTime = (payTime % 1) >= 0.25 ? Math.ceil(payTime) : Math.floor(payTime);
    //
    //     if (delivery.owner === 'ВСП') {
    //       payTime = calculationTime;
    //     }
    //
    //     let penaltyTime = calculationTime - payTime;
    //     const shuntingWorkTime = delivery.shuntingWorks != null ? delivery.shuntingWorks : 0;
    //
    //     let paySum = 0;
    //     let penaltySum = 0;
    //     let shuntingWorkSum = 0;
    //
    //     if (delivery.owner === 'Собств.(аренда)' || delivery.cargoType === 'ВЕСОПОВЕРОЧНЫЙ') {
    //       // calculationTime = 0;
    //       payTime = 0;
    //       paySum = 0;
    //       penaltyTime = 0;
    //       penaltySum = 0;
    //     }
    //
    //     shuntingWorkSum = shuntingWorkTime * this.statementRate.shuntingTariff.tariff;
    //
    //     if (payTime > 0) {
    //       this.baseRateAndPenaltySub = this.deliveryService
    //         .getBaseRateAndPenalty(delivery.deliveryId, payTime, this.statement.created).subscribe(data => {
    //           paySum = +(data.baseRate * this.statementRate.indexToBaseRate.indexToRate).toFixed(1);
    //           penaltySum = data.penalty * penaltyTime;
    //         }, () => {
    //           this.alert.danger('Ошибка при загрузке базовой ставки и штрафа');
    //         }, () => {
    //
    //           if (delivery.owner === 'СНГ') {
    //             paySum = paySum * 1.3;
    //           }
    //
    //           const totalSum = this.statementRate.deliveryDispatchTariff.tariff + paySum + penaltySum + shuntingWorkSum;
    //
    //           delivery.calculation = {
    //             totalTime, calculationTime, payTime, paySum, penaltyTime, penaltySum, shuntingWorkTime, shuntingWorkSum, totalSum
    //           };
    //
    //           // this.totalCost += totalSum;
    //         });
    //     } else {
    //       delivery.calculation = {
    //         totalTime,
    //         calculationTime,
    //         payTime: 0,
    //         paySum: 0,
    //         penaltyTime: 0,
    //         penaltySum: 0,
    //         shuntingWorkTime,
    //         shuntingWorkSum,
    //         totalSum: shuntingWorkSum + this.statementRate.deliveryDispatchTariff.tariff
    //       };
    //       // this.totalCost += shuntingWorkSum + this.statementRate.deliveryDispatchTariff.tariff;
    //     }
    //
    //   });
    //
    //   return deliveryList;
    // }

    public loadSuitableMemos(statementId: number): void {
        this.suitableMemoSub = this.memoOfDispatchService.getSuitableMemosForStatement(statementId).subscribe(memos => {
            this.suitableMemos = memos;
        }, error => {
            throwError(error);
        });
    }

    // загружаем один из двух шаблонов
    loadTemplate(memoOfDispatch: MemoOfDispatch): TemplateRef<any> {
        if (this.editedMemo && this.editedMemo.memoOfDispatchId === memoOfDispatch.memoOfDispatchId) {
            return this.editTemplate;
        } else {
            return this.readOnlyTemplate;
        }
    }

    getById(memoId: number): number {
        if (memoId) {
            return this.memoList.find(value => value.memoOfDispatchId === memoId).memoOfDispatchId;
        }
        return 0;
    }

    addMemoById(): void {
        if (!this.suitableMemos.find(memo => memo.memoOfDispatchId === this.memoIdToAdd)) {
            this.alert.warning('Нет подходящей памятки с таким номером');
            this.memoIdToAdd = null;
            return;
        }
        this.addMemoSub = this.memoOfDispatchService.addStatement(this.memoIdToAdd.toString(), String(this.statementId))
            .subscribe(() => {
                this.memoIdToAdd = null;
            }, () => {
                this.alert.danger('Ошибка при добавлении памятки по номеру');
            }, () => {
                this.alert.success('В общую подачу добавлена ведомость приемосдатчика');
            });

        const memoOfDispatch: MemoOfDispatch = this.suitableMemos.find(memo => memo.memoOfDispatchId === this.memoIdToAdd);
        this.memoList.push(memoOfDispatch);
        this.suitableMemos = this.suitableMemos.filter(memo => memo.memoOfDispatchId !== this.memoIdToAdd);
    }

    removeStatementFromMemo(memoId): void {
        this.removeMemoSub = this.memoOfDispatchService.removeStatement(memoId).subscribe((data) => {
            this.suitableMemos.push(this.memoList.find(memo => memo.memoOfDispatchId === memoId));
            this.memoList = this.memoList.filter(memo => memo.memoOfDispatchId !== memoId);
        }, () => {
            this.alert.danger('Ошибка при откреплении памятки от ведомости');
        }, () => {
            this.alert.success('Памятка откреплена от ведомости');
        });
    }

    addAllSuitableMemos(): void {
        this.memoIdToAdd = null;
        this.addListMemoSub = this.memoOfDispatchService
            .addStatementToMemoOfDispatchList(this.suitableMemos.map(memo => memo.memoOfDispatchId), this.statementId)
            .subscribe(() => {
            }, () => {
                this.alert.danger('Ошибка при добавлении всех подходящих памяток');
            }, () => {
                this.alert.success('Все подходящие памятки добавлены');
            });

        this.memoList = this.memoList.concat(this.suitableMemos);
        this.suitableMemos = [];
    }

    removeAllMemoFromStatement(): void {
        const memoIds = this.memoList.map(memo => memo.memoOfDispatchId);
        this.removeAllMemoSub = this.memoOfDispatchService.removeStatementFromAllMemo(memoIds).subscribe(() => {
            this.loadSuitableMemos(this.statementId);
            this.memoList = [];
        }, () => {
            this.alert.danger('Ошибка при откреплении памяток');
        }, () => {
            this.alert.success('Все памятки убраны из ведомости');
        });
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.createSub,
            this.updateSub,
            this.addMemoSub,
            this.addListMemoSub,
            this.removeMemoSub,
            this.removeAllMemoSub,
            this.suitableMemoSub
        ]);
    }

    calcSummary(): number {
        let summary;
        for (const delivery of this.deliveryList) {
            summary += delivery.calculation ? delivery.calculation.totalSum : 0;
        }
        return summary;
    }
}
