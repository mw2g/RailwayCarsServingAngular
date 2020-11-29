import {Component, OnDestroy, OnInit} from '@angular/core';
import {Statement, MemoOfDelivery, Customer, CargoOperation} from '../../shared/interfaces';
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
  sortById = true;
  sortByDate: boolean;
  sortByMemoQuantity: boolean;
  searchStr = '';

  beforeDate: Date = new Date();
  afterDate: Date = new Date();

  constructor(private statementService: StatementService,
              public router: Router,
              private alert: AlertService,
              private utils: UtilsService,
              private cargoOperationService: CargoOperationService,
              private customerService: CustomerService
  ) {
  }

  ngOnInit(): void {
    this.cargoOperations = this.cargoOperationService.getAll();
    this.customers = this.customerService.getAll();
    this.afterDate.setFullYear(this.afterDate.getFullYear() - 1);
    this.afterDate.setDate(this.afterDate.getDay() - 5);
    this.loadStatement();
  }

  sortListById(): void {
    this.sortByMemoQuantity = null;
    this.sortByDate = null;
    if (this.sortById) {
      this.statements = [...this.statements.sort((a, b) => a.statementId < b.statementId ? 1 : -1)];
      this.sortById = false;
    } else {
      this.statements = [...this.statements.sort((a, b) => a.statementId > b.statementId ? 1 : -1)];
      this.sortById = true;
    }
  }

  loadStatement(): void {
    if (this.afterDate) {
      this.afterDate = new Date(this.afterDate);
    } else {
      this.afterDate = new Date(2019, 0);
    }
    if (this.beforeDate) {
      this.beforeDate = new Date(this.beforeDate);
    } else {
      this.beforeDate = new Date();
    }
    this.statementsSub = this.statementService.getAllStatements(this.afterDate, this.beforeDate).subscribe(statements => {
      this.statements = statements;
    }, error => {
      throwError(error);
    });
  }

  sortListByDate(): void {
    this.sortById = null;
    this.sortByMemoQuantity = null;
    if (this.sortByDate) {
      this.statements = [...this.statements.sort((a, b) => a.created < b.created ? 1 : -1)];
      this.sortByDate = false;
    } else {
      this.statements = [...this.statements.sort((a, b) => a.created > b.created ? 1 : -1)];
      this.sortByDate = true;
    }
  }

  sortListByWagonQuantity(): void {
    this.sortById = null;
    this.sortByDate = null;
    if (this.sortByMemoQuantity) {
      this.statements = [...this.statements.sort((a, b) => a.memoOfDispatchList.length < b.memoOfDispatchList.length ? 1 : -1)];
      this.sortByMemoQuantity = false;
    } else {
      this.statements = [...this.statements.sort((a, b) => a.memoOfDispatchList.length > b.memoOfDispatchList.length ? 1 : -1)];
      this.sortByMemoQuantity = true;
    }
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.statementsSub
    ]);
  }
}
