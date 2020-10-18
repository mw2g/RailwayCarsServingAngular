import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription, throwError} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {MemoOfDispatchService} from '../memo-of-dispatch.service';
import {CargoOperation, Customer, DeliveryOfWagon, MemoOfDispatch} from '../../shared/interfaces';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../shared/service/utils.service.';
import {ListDeliveryInMemoOfDispatchComponent} from '../list-delivery-in-memo-of-dispatch/list-delivery-in-memo-of-dispatch.component';
import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';

@Component({
  selector: 'app-edit-memo-of-dispatch',
  templateUrl: './form-memo-of-dispatch.component.html',
  styleUrls: ['./form-memo-of-dispatch.component.scss'],
  providers: [DatePipe]
})
export class FormMemoOfDispatchComponent implements OnInit, OnDestroy {

  @ViewChild(ListDeliveryInMemoOfDispatchComponent) listDeliveryInMemoOfDispatchComponent: ListDeliveryInMemoOfDispatchComponent;
  memoOfDispatchId: number;
  deliveryList: DeliveryOfWagon[] = [];
  memoOfDispatch: MemoOfDispatch;

  form: FormGroup;

  private customers: Array<Customer>;
  private cargoOperations: Array<CargoOperation>;
  private mSub: Subscription;
  private customersSub: Subscription;
  private cargoOperationSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private memoOfDispatchService: MemoOfDispatchService,
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
        if (params.memoOfDispatchId) {
          this.memoOfDispatchId = params.memoOfDispatchId;
          return this.memoOfDispatchService.getById(params.memoOfDispatchId);
        } else {
          this.initEmptyForm();
          return new Observable<MemoOfDispatch>();
        }
      })
    ).subscribe((memoOfDispatch: MemoOfDispatch) => {
      this.memoOfDispatch = memoOfDispatch;
      this.deliveryList = memoOfDispatch.deliveryOfWagonList;
      this.loadForm();
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      memoOfDispatchId: new FormControl(this.memoOfDispatch.memoOfDispatchId),
      created: new FormControl(this.datePipe.transform(
        this.memoOfDispatch.created.valueOf() * 1000, 'yyyy-MM-ddTHH:mm'), Validators.required),
      endDate: new FormControl(this.datePipe.transform(this.memoOfDispatch.endDate, 'yyyy-MM-ddTHH:mm'), Validators.required),
      cargoOperation: new FormControl(this.memoOfDispatch.cargoOperation.operation, Validators.required),
      customer: new FormControl(this.memoOfDispatch.customer.customerName, Validators.required),
      author: new FormControl(this.memoOfDispatch.author),
      signer: new FormControl(this.memoOfDispatch.signer.initials),
      comment: new FormControl(this.memoOfDispatch.comment),
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      endDate: new FormControl('', Validators.required),
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
  }

  // checkForm(): boolean {
  //   if (this.form.invalid) {
  //     this.alert.warning('Форма невалидна');
  //     // this.utils.markFormGroupTouched(this.form);
  //     return true;
  //   }
  //   if (!this.customers.find(customer => customer.customerName === this.form.value.customer)) {
  //     this.alert.warning('Неверный ввод контрагента');
  //     this.form.get('customer').setValue('');
  //     return true;
  //   }
  //   return false;
  // }

  update(): void {
    if (this.utils.checkForm(this.alert, this.form, this.customers)) {
      return;
    }
    this.mSub = this.memoOfDispatchService.update({
      ...this.memoOfDispatch,
      created: new Date(this.form.value.created),
      endDate: new Date(this.form.value.endDate),
      cargoOperation: {operation: this.form.value.cargoOperation},
      customer: {customerName: this.form.value.customer},
      signer: {initials: this.form.value.signer},
      comment: this.form.value.comment,
      // author: this.form.value.author,
    }).subscribe((data) => {
      this.alert.success(data.message);
      this.ngOnInit();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.listDeliveryInMemoOfDispatchComponent.loadSuitableDeliveries(this.memoOfDispatchId);
    });
  }

  create(): void {
    if (this.utils.checkForm(this.alert, this.form, this.customers)) {
      return;
    }
    this.mSub = this.memoOfDispatchService.create({
      ...this.memoOfDispatch,
      endDate: new Date(this.form.value.endDate),
      cargoOperation: {operation: this.form.value.cargoOperation},
      customer: {customerName: this.form.value.customer},
      comment: this.form.value.comment,
      // author: this.form.value.author,
    }).subscribe((data) => {
      this.memoOfDispatchId = data.memoOfDispatchId;
      this.memoOfDispatch = data;
      this.deliveryList.concat(data.deliveryOfWagonList);
      this.form.addControl('memoId', new FormControl(data.memoOfDispatchId));
      this.form.addControl('created', new FormControl(new Date(data.created)));
      this.form.addControl('author', new FormControl(data.author));
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Памятка создана');
    });
  }
}
