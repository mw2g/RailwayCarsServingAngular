import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription, throwError} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {ControllerStatementService} from '../controller-statement.service';
import {CargoOperation, ControllerStatement, Customer, DeliveryOfWagon, MemoOfDelivery, MemoOfDispatch} from '../../shared/interfaces';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../shared/service/utils.service.';
import {ListMemoInControllerStatementComponent} from '../list-memo-in-controller-statement/list-memo-in-controller-statement.component';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';

@Component({
  selector: 'app-edit-controller-statement',
  templateUrl: './form-controller-statement.component.html',
  styleUrls: ['./form-controller-statement.component.scss'],
  providers: [DatePipe]
})
export class FormControllerStatementComponent implements OnInit, OnDestroy {

  @ViewChild(ListMemoInControllerStatementComponent) listMemoInControllerStatementComponent: ListMemoInControllerStatementComponent;
  statementId: number;
  memoList: MemoOfDispatch[] = [];
  controllerStatement: ControllerStatement;

  form: FormGroup;

  private customers: Array<Customer>;
  private mSub: Subscription;
  private customersSub: Subscription;
  private cargoOperationSub: Subscription;
  private cargoOperations: Array<CargoOperation>;


  constructor(
    private route: ActivatedRoute,
    private controllerStatementService: ControllerStatementService,
    private customerService: CustomerService,
    private cargoOperationService: CargoOperationService,
    public router: Router,
    private alert: AlertService,
    private datePipe: DatePipe,
    private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.cargoOperationSub = this.cargoOperationService.getAll().subscribe(data => {
      this.cargoOperations = data;
    }, error => {
      throwError(error);
    });

    this.customersSub = this.customerService.getAll().subscribe(customers => {
      this.customers = customers;
    }, error => {
      throwError(error);
    });

    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params.statementId) {
          this.statementId = params.statementId;
          return this.controllerStatementService.getById(params.statementId);
        } else {
          this.initEmptyForm();
          return new Observable<MemoOfDelivery>();
        }
      })
    ).subscribe((statement: ControllerStatement) => {
      this.controllerStatement = statement;
      this.memoList = statement.memoOfDispatchList;
      this.loadForm();
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      statementId: new FormControl(this.controllerStatement.statementId),
      created: new FormControl(this.controllerStatement.created, Validators.required),
      cargoOperation: new FormControl(this.controllerStatement.cargoOperation.operationId, Validators.required),
      customer: new FormControl(this.controllerStatement.customer.customerName, Validators.required),
      author: new FormControl(this.controllerStatement.author),
      signer: new FormControl(this.controllerStatement.signer.initials),
      comment: new FormControl(this.controllerStatement.comment),
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

  ngOnDestroy(): void {
    if (this.mSub) {
      this.mSub.unsubscribe();
    }
    if (this.cargoOperationSub) {
      this.cargoOperationSub.unsubscribe();
    }
  }

  update(): void {
    if (this.utils.checkForm(this.alert, this.form, this.customers)) {
      return;
    }
    this.mSub = this.controllerStatementService.update({
      ...this.controllerStatement,
      cargoOperation: {operationId: this.form.value.cargoOperation},
      customer: {customerName: this.form.value.customer},
      signer: {initials: this.form.value.signer},
      comment: this.form.value.comment
    }).subscribe((data) => {
      this.controllerStatement = data;
      this.memoList = data.memoOfDispatchList;
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Ведомость сохранена');
      this.form.markAsPristine();
      this.listMemoInControllerStatementComponent.loadSuitableMemos(this.statementId);
    });
  }

  create(): void {
    if (this.utils.checkForm(this.alert, this.form, this.customers)) {
      return;
    }
    this.mSub = this.controllerStatementService.create({
      ...this.controllerStatement,
      cargoOperation: {operationId: this.form.value.cargoOperation},
      customer: {customerName: this.form.value.customer},
      comment: this.form.value.comment,
      // author: this.form.value.author,
    }).subscribe((data) => {
      this.statementId = data.statementId;
      this.controllerStatement = data;
      this.memoList.concat(data.memoOfDispatchList);
      this.form.addControl('memoId', new FormControl(data.statementId));
      this.form.addControl('created', new FormControl(new Date(data.created)));
      this.form.addControl('author', new FormControl(data.author));
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Памятка создана');
    });
  }
}
