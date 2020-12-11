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
        const staticReportViewSettings = JSON.parse(localStorage.getItem('staticReportViewSettings'));
        if (staticReportViewSettings) {
            this.afterDate = staticReportViewSettings.afterDate ? staticReportViewSettings.afterDate : this.afterDate;
            this.beforeDate = staticReportViewSettings.beforeDate ? staticReportViewSettings.beforeDate : this.beforeDate;
            this.customer = staticReportViewSettings.customer ? staticReportViewSettings.customer : this.customer;
        }
        this.customers = this.customerService.getAll();
        this.loadReport();
    }

    print(): void {
        window.print();
    }

    loadReport(): void {
        this.afterDate = this.utils.prepareDate(this.afterDate, new Date(new Date().getFullYear() - 1, new Date().getMonth() - 1));
        this.beforeDate = this.utils.prepareDate(this.beforeDate, new Date());

        this.reportSub = this.reportService.getStaticReport(this.afterDate, this.beforeDate, this.customer).subscribe(reportRows => {
            this.staticReportRows = reportRows;

        }, error => {
            throwError(error);
        });
        this.saveViewSettings();
    }

    private saveViewSettings(): void {
        const staticReportViewSettings = {
            afterDate: this.afterDate,
            beforeDate: this.beforeDate,
            customer: this.customer
        };
        localStorage.setItem('staticReportViewSettings', JSON.stringify(staticReportViewSettings));
    }

    ngOnDestroy(): void {
        this.saveViewSettings();
        this.utils.unsubscribe([
            this.reportSub
        ]);
    }
}
