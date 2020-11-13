import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription, throwError} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {StatementService} from '../statement.service';
import {CargoOperation, Statement, Customer, MemoOfDispatch, StatementRate, StatementWithRate} from '../../shared/interfaces';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../shared/service/utils.service';
import {ListMemoInStatementComponent} from '../list-memo-in-statement/list-memo-in-statement.component';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {TimeNormService} from '../../reference/service/time-norm.service';
import {BaseRateService} from '../../reference/service/base-rate.service';
import {IndexToBaseRateService} from '../../reference/service/index-to-base-rate.service';
import {TariffService} from '../../reference/service/tariff.service';

@Component({
  selector: 'app-edit-statement',
  templateUrl: './form-statement.component.html',
  styleUrls: ['./form-statement.component.scss'],
  providers: [DatePipe]
})
export class FormStatementComponent implements OnInit, OnDestroy {

  @ViewChild(ListMemoInStatementComponent) listMemoInStatementComponent: ListMemoInStatementComponent;
  statementId: number;
  memoList: MemoOfDispatch[] = [];
  statement: Statement;
  statementRate: StatementRate;

  form: FormGroup;

  private customers: Observable<Array<Customer>>;
  private cargoOperations: Observable<Array<CargoOperation>>;
  private loadSub: Subscription;
  private createSub: Subscription;
  private updateSub: Subscription;
  private rateSub: Subscription;
  enableComment = true;


  constructor(
    private route: ActivatedRoute,
    private statementService: StatementService,
    private customerService: CustomerService,
    private cargoOperationService: CargoOperationService,
    private timeNormService: TimeNormService,
    private baseRateService: BaseRateService,
    private indexToBaseRateService: IndexToBaseRateService,
    private tariffService: TariffService,
    public router: Router,
    private alert: AlertService,
    private datePipe: DatePipe,
    private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.cargoOperations = this.cargoOperationService.getAll();
    this.customers = this.customerService.getAll();

    this.loadSub = this.route.params.pipe(
      switchMap((params: Params) => {
        if (params.statementId) {
          this.statementId = params.statementId;
          return this.statementService.getById(params.statementId);
        } else {
          this.initEmptyForm();
          return new Observable<StatementWithRate>();
        }
      })
    ).subscribe((statementWithRate: StatementWithRate) => {
      this.statement = statementWithRate.statement;
      this.statementRate = statementWithRate.rate;
      this.memoList = this.statement.memoOfDispatchList;
      this.enableComment = !!this.statement.comment;
      this.loadForm();
    }, error => {
      throwError(error);
    }, () => {
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      statementId: new FormControl(this.statement.statementId),
      // created: new FormControl(this.statement.created, Validators.required),
      created: new FormControl(this.datePipe.transform(this.statement.created, 'yyyy-MM-ddTHH:mm'), Validators.required),
      cargoOperation: new FormControl(this.statement.cargoOperation, Validators.required),
      customer: new FormControl(this.statement.customer, Validators.required),
      author: new FormControl(this.statement.author),
      signer: new FormControl(this.statement.signer),
      comment: new FormControl(this.statement.comment),
      deliveryDispatchTimeNorm: new FormControl(this.statementRate.deliveryDispatchTimeNorm.norm),
      turnoverTimeNorm: new FormControl(this.statementRate.turnoverTimeNorm.norm),
      deliveryDispatchTariff: new FormControl(this.statementRate.deliveryDispatchTariff.tariff),
      shuntingTariff: new FormControl(this.statementRate.shuntingTariff.tariff),
      indexToBaseRate: new FormControl(this.statementRate.indexToBaseRate.indexToRate)
    });

    // if (this.statement.statementId) {
    //   this.loadRate();
    // }
  }

  loadRate(): void {

    this.rateSub = this.statementService.getStatementRate(this.statement.statementId).subscribe(data => {
      this.statementRate = data;
    }, error => {
      throwError(error);
    }, () => {

      // this.form.addControl('deliveryDispatchTimeNorm', new FormControl(this.statementRate.deliveryDispatchTimeNorm));
      // this.form.addControl('turnoverTimeNorm', new FormControl(this.statementRate.turnoverTimeNorm));
      // this.form.addControl('deliveryDispatchTariff', new FormControl(this.statementRate.deliveryDispatchTariff));
      // this.form.addControl('shuntingTariff', new FormControl(this.statementRate.shuntingTariff));
      // this.form.addControl('indexToBaseRate', new FormControl(this.statementRate.indexToBaseRate));
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      cargoOperation: new FormControl('1', Validators.required),
      customer: new FormControl('', Validators.required),
      signer: new FormControl(''),
      comment: new FormControl(''),
    });
  }

  update(): void {
    if (this.form.invalid) {
      this.alert.warning('Форма невалидна');
      return;
    }
    this.updateSub = this.statementService.update({
      ...this.statement,
      created: this.form.value.created,
      cargoOperation: this.form.value.cargoOperation,
      customer: this.form.value.customer,
      signer: this.form.value.signer,
      comment: this.form.value.comment
    }).subscribe((data) => {
      this.statement = data;
      this.memoList = data.memoOfDispatchList;
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Ведомость сохранена');
      this.form.markAsPristine();
      this.listMemoInStatementComponent.loadSuitableMemos(this.statementId);
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.alert.warning('Форма невалидна');
      return;
    }
    this.createSub = this.statementService.create({
      ...this.statement,
      created: this.form.value.created,
      cargoOperation: this.form.value.cargoOperation,
      customer: this.form.value.customer,
      comment: this.form.value.comment,
      // author: this.form.value.author,
    }).subscribe((data) => {
      this.statementId = data.statementId;
      this.statement = data;
      this.memoList.concat(data.memoOfDispatchList);
      this.form.addControl('statementId', new FormControl(data.statementId));
      this.form.addControl('created', new FormControl(new Date(data.created)));
      this.form.addControl('author', new FormControl(data.author));
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Памятка создана');
    });
  }


  clearComment(): void {
    this.form.get('comment').reset();
    this.enableComment = false;
    if (this.statement.comment) {
      this.form.markAsDirty();
    }
  }

  // getCustomerSigners(customerName: string): Signer[] {
  //   return this.customers.find(customer => customer.customerName === customerName).signerList;
  // }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.loadSub,
      this.createSub,
      this.updateSub,
      this.rateSub
    ]);
  }
}
