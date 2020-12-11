import {Component, OnDestroy, OnInit} from '@angular/core';
import {CargoOperation, Customer, GeneralSetReportRow} from '../../shared/interfaces';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription, throwError} from 'rxjs';
import {UtilsService} from '../../shared/service/utils.service';
import {CustomerService} from '../../reference/service/customer.service';
import {ReportService} from '../report.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';

@Component({
    selector: 'app-general-set-of-rail-services-report',
    templateUrl: './general-set-of-rail-services-report.component.html',
    styleUrls: ['./general-set-of-rail-services-report.component.scss']
})
export class GeneralSetOfRailServicesReportComponent implements OnInit, OnDestroy {

    reportRows: GeneralSetReportRow[] = [];
    private reportSub: Subscription;
    afterDate: Date;
    beforeDate: Date;
    customers: Observable<Array<Customer>>;
    cargoOperations: Observable<Array<CargoOperation>>;
    customer = '';
    operation = '';

    constructor(
        private route: ActivatedRoute,
        private utils: UtilsService,
        private customerService: CustomerService,
        private cargoOperationService: CargoOperationService,
        private reportService: ReportService
    ) {
    }

    ngOnInit(): void {
        const generalSetReportViewSettings = JSON.parse(localStorage.getItem('generalSetReportViewSettings'));
        if (generalSetReportViewSettings) {
            this.afterDate = generalSetReportViewSettings.afterDate ? generalSetReportViewSettings.afterDate : this.afterDate;
            this.beforeDate = generalSetReportViewSettings.beforeDate ? generalSetReportViewSettings.beforeDate : this.beforeDate;
            this.operation = generalSetReportViewSettings.operation ? generalSetReportViewSettings.operation : this.operation;
            this.customer = generalSetReportViewSettings.customer ? generalSetReportViewSettings.customer : this.customer;
        }
        this.customers = this.customerService.getAll();
        this.cargoOperations = this.cargoOperationService.getAll();
        this.loadReport();
    }

    print(): void {
        window.print();
    }

    loadReport(): void {
        this.afterDate = this.utils.prepareDate(this.afterDate, new Date(new Date().getFullYear() - 1, new Date().getMonth() - 1));
        this.beforeDate = this.utils.prepareDate(this.beforeDate, new Date());

        this.reportSub = this.reportService.getGeneralSetReport(this.afterDate, this.beforeDate, this.operation, this.customer).
        subscribe(reportRows => {
            this.reportRows = reportRows;

        }, error => {
            throwError(error);
        });
        this.saveViewSettings();
    }

    private saveViewSettings(): void {
        const generalSetReportViewSettings = {
            afterDate: this.afterDate,
            beforeDate: this.beforeDate,
            operation: this.operation,
            customer: this.customer
        };
        localStorage.setItem('generalSetReportViewSettings', JSON.stringify(generalSetReportViewSettings));
    }

    ngOnDestroy(): void {
        this.saveViewSettings();
        this.utils.unsubscribe([
            this.reportSub
        ]);
    }
}
