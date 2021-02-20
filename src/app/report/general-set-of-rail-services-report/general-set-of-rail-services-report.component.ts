import {Component, OnDestroy, OnInit} from '@angular/core';
import {CargoOperation, Customer, GeneralSetReportRow} from '../../shared/interfaces';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription, throwError} from 'rxjs';
import {UtilsService} from '../../shared/service/utils.service';
import {CustomerService} from '../../reference/service/customer.service';
import {ReportService} from '../report.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {SettingService} from '../../reference/service/setting.service';

@Component({
    selector: 'app-general-set-of-rail-services-report',
    templateUrl: './general-set-of-rail-services-report.component.html',
    styleUrls: ['./general-set-of-rail-services-report.component.scss']
})
export class GeneralSetOfRailServicesReportComponent implements OnInit, OnDestroy {

    reportRows: GeneralSetReportRow[] = [];
    private settingSub: Subscription;
    private reportSub: Subscription;
    companyFullName: string;
    director: string;
    afterDate: Date;
    beforeDate: Date;
    customers: Observable<Array<Customer>>;
    cargoOperations: Observable<Array<CargoOperation>>;
    customer = '';
    withoutOperation = false;

    constructor(
        private route: ActivatedRoute,
        private utils: UtilsService,
        private customerService: CustomerService,
        private cargoOperationService: CargoOperationService,
        private settingService: SettingService,
        private reportService: ReportService
    ) {
    }

    ngOnInit(): void {
        this.settingSub = this.settingService.getByType(['companyFullName', 'director']).subscribe(data => {
            this.companyFullName = data[0];
            this.director = data[1];
        });

        const generalSetReportViewSettings = JSON.parse(localStorage.getItem('generalSetReportViewSettings'));
        if (generalSetReportViewSettings) {
            this.afterDate = generalSetReportViewSettings.afterDate ? generalSetReportViewSettings.afterDate : this.afterDate;
            this.beforeDate = generalSetReportViewSettings.beforeDate ? generalSetReportViewSettings.beforeDate : this.beforeDate;
            this.withoutOperation = generalSetReportViewSettings
                .withoutOperation ? generalSetReportViewSettings.withoutOperation : this.withoutOperation;
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
        this.afterDate = this.utils.prepareDate(this.afterDate, new Date(new Date().getFullYear(), new Date().getMonth() - 1));
        this.beforeDate = this.utils.prepareDate(this.beforeDate, new Date());

        const excludeOperation = !this.withoutOperation ? 'БЕЗ ОПЕРАЦИИ' : '';
        this.reportSub = this.reportService.getGeneralSetReport(this.afterDate, this.beforeDate, excludeOperation, this.customer)
            .subscribe(reportRows => {
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
            withoutOperation: this.withoutOperation,
            customer: this.customer
        };
        localStorage.setItem('generalSetReportViewSettings', JSON.stringify(generalSetReportViewSettings));
    }

    ngOnDestroy(): void {
        this.saveViewSettings();
        this.utils.unsubscribe([
            this.reportSub,
            this.settingSub
        ]);
    }
}
