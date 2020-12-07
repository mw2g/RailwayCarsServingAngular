import {Component, OnDestroy, OnInit} from '@angular/core';
import {Customer, DeliveryOfWagon, MemoOfDispatch, Statement, StaticReportRow} from '../../shared/interfaces';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription, throwError} from 'rxjs';
import {UtilsService} from '../../shared/service/utils.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';
import {ReportService} from '../report.service';

@Component({
    selector: 'app-brief-statistical-report',
    templateUrl: './brief-statistical-report.component.html',
    styleUrls: ['./brief-statistical-report.component.scss']
})
export class BriefStatisticalReportComponent implements OnInit, OnDestroy {

    sumWeight = 0;
    sumShuntingWork = 0;
    staticReportRows: StaticReportRow[] = [];
    private reportSub: Subscription;
    afterDate: Date;
    beforeDate: Date;
    customers: Observable<Array<Customer>>;
    customer = '';

    constructor(
        private route: ActivatedRoute,
        private utils: UtilsService,
        private customerService: CustomerService,
        private reportService: ReportService
    ) {
    }

    ngOnInit(): void {
        this.customers = this.customerService.getAll();
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

    loadReport(): void {
        this.afterDate = this.utils.prepareDate(this.afterDate, new Date(new Date().getFullYear() - 1, new Date().getMonth() - 1));
        this.beforeDate = this.utils.prepareDate(this.beforeDate, new Date());

        this.reportSub = this.reportService.getStaticReport(this.afterDate, this.beforeDate).subscribe(reportRows => {
            this.staticReportRows = reportRows;

        }, error => {
            throwError(error);
        });
    }

    ngOnDestroy(): void {
        this.utils.unsubscribe([
            this.reportSub
        ]);
    }
}
