import {Component, OnDestroy, OnInit} from '@angular/core';
import {CargoOperation, Customer, Statement} from '../../shared/interfaces';
import {Observable, Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {StatementService} from '../statement.service';
import {UtilsService} from '../../shared/service/utils.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {CustomerService} from '../../reference/service/customer.service';

@Component({
    selector: 'app-list-statement',
    templateUrl: './list-statement.component.html',
    styleUrls: ['./list-statement.component.scss']
})
export class ListStatementComponent implements OnInit, OnDestroy {

    statements: Statement[] = [];
    statementsSub: Subscription;
    cargoOperations: Observable<Array<CargoOperation>>;
    customers: Observable<Array<Customer>>;

    cargoOperationFilter = '';
    customerFilter = '';
    sortState = {statementId: null, created: false, memoQuantity: null};
    searchStr = '';

    afterDate: Date;
    beforeDate: Date;

    constructor(private statementService: StatementService,
                public router: Router,
                private alert: AlertService,
                public utils: UtilsService,
                private cargoOperationService: CargoOperationService,
                private customerService: CustomerService
    ) {
    }

    ngOnInit(): void {
        const statementViewSettings = JSON.parse(localStorage.getItem('statementViewSettings'));
        if (statementViewSettings) {
            this.sortState = statementViewSettings.sortState ? statementViewSettings.sortState : this.sortState;
            this.searchStr = statementViewSettings.searchStr ? statementViewSettings.searchStr : '';
            this.customerFilter = statementViewSettings.customerFilter ? statementViewSettings.customerFilter : '';
            this.cargoOperationFilter = statementViewSettings.cargoOperationFilter ? statementViewSettings.cargoOperationFilter : '';
            this.afterDate = statementViewSettings.afterDate ? statementViewSettings.afterDate : this.afterDate;
            // this.beforeDate = statementViewSettings.beforeDate ? statementViewSettings.beforeDate : this.beforeDate;
        }
        this.cargoOperations = this.cargoOperationService.getAll();
        this.customers = this.customerService.getAll();
        this.loadStatement();
    }

    sortList(field: string, primer?, fromMemo?): void {
        if (!fromMemo) {
            for (const key of Object.keys(this.sortState)) {
                this.sortState[key] = key === field ? !this.sortState[key] : null;
            }
        }
        const prep = primer ? (x) => primer(x) : (x) => x[field];
        const reverse = this.sortState[field] ? 1 : -1;
        this.statements = [...this.statements.sort((a, b) => {
            return a = prep(a), b = prep(b), reverse * (a > b ? 1 : -1);
        })];
    }

    public memoListLengthFunc = (statement: Statement): number => statement.memoOfDispatchList.length;

    clearViewSettings(): void {
        localStorage.removeItem('statementViewSettings');
        this.sortState = {statementId: null, created: false, memoQuantity: null};
        this.searchStr = '';
        this.customerFilter = '';
        this.cargoOperationFilter = '';
        this.afterDate = new Date();
        this.afterDate.setFullYear(this.afterDate.getFullYear(), new Date().getMonth() - 1);
        this.beforeDate = new Date();

        this.loadStatement();
    }

    loadStatement(): void {
        this.afterDate = this.utils.prepareDate(this.afterDate, new Date(new Date().getFullYear() - 1, new Date().getMonth() - 1));
        this.beforeDate = this.utils.prepareDate(this.beforeDate, new Date());

        this.statementsSub = this.statementService.getAllStatements(this.afterDate, this.beforeDate).subscribe(statements => {
            this.statements = statements;
            for (const key of Object.keys(this.sortState)) {
                if (this.sortState[key] != null) {
                    this.sortList(key, key === 'memoQuantity' ? this.memoListLengthFunc : null, true);
                    return;
                }
            }
        }, error => {
            throwError(error);
        });
        this.saveViewSettings();
    }

    ngOnDestroy(): void {
        this.saveViewSettings();

        this.utils.unsubscribe([
            this.statementsSub
        ]);
    }

    private saveViewSettings(): void {
        const statementViewSettings = {
            sortState: this.sortState,
            searchStr: this.searchStr,
            customerFilter: this.customerFilter,
            cargoOperationFilter: this.cargoOperationFilter,
            afterDate: this.afterDate,
            beforeDate: this.beforeDate
        };
        localStorage.setItem('statementViewSettings', JSON.stringify(statementViewSettings));
    }
}
