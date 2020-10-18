import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription, throwError} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {CargoOperation, Customer, DeliveryOfWagon, MemoOfDelivery} from '../../shared/interfaces';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../shared/service/utils.service.';
import {ListDeliveryInMemoOfDeliveryComponent} from '../list-delivery-in-memo-of-delivery/list-delivery-in-memo-of-delivery.component';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';

@Component({
  selector: 'app-edit-controller-statement',
  templateUrl: './form-memo-of-delivery.component.html',
  styleUrls: ['./form-memo-of-delivery.component.scss'],
  providers: [DatePipe]
})
export class FormMemoOfDeliveryComponent implements OnInit, OnDestroy {

  @ViewChild(ListDeliveryInMemoOfDeliveryComponent) listDeliveryInMemoOfDeliveryComponent: ListDeliveryInMemoOfDeliveryComponent;
  memoOfDeliveryId: number;
  deliveryList: DeliveryOfWagon[] = [];
  memoOfDelivery: MemoOfDelivery;

  form: FormGroup;

  private customers: Array<Customer>;
  private cargoOperations: Array<CargoOperation>;
  private mSub: Subscription;
  private customersSub: Subscription;
  private cargoOperationSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private memoOfDeliveryService: MemoOfDeliveryService,
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
        if (params.memoOfDeliveryId) {
          this.memoOfDeliveryId = params.memoOfDeliveryId;
          return this.memoOfDeliveryService.getById(params.memoOfDeliveryId);
        } else {
          this.initEmptyForm();
          return new Observable<MemoOfDelivery>();
        }
      })
    ).subscribe((memoOfDelivery: MemoOfDelivery) => {
      this.memoOfDelivery = memoOfDelivery;
      this.deliveryList = memoOfDelivery.deliveryOfWagonList;
      this.loadForm();
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      memoOfDeliveryId: new FormControl(this.memoOfDelivery.memoOfDeliveryId),
      created: new FormControl(this.memoOfDelivery.created, Validators.required),
      startDate: new FormControl(this.datePipe.transform(this.memoOfDelivery.startDate, 'yyyy-MM-ddTHH:mm'), Validators.required),
      cargoOperation: new FormControl(this.memoOfDelivery.cargoOperation.operation, Validators.required),
      customer: new FormControl(this.memoOfDelivery.customer.customerName, Validators.required),
      author: new FormControl(this.memoOfDelivery.author),
      signer: new FormControl(this.memoOfDelivery.signer.initials),
      comment: new FormControl(this.memoOfDelivery.comment),
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      startDate: new FormControl('', Validators.required),
      cargoOperation: new FormControl('', Validators.required),
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
    this.mSub = this.memoOfDeliveryService.update({
      ...this.memoOfDelivery,
      startDate: new Date(this.form.value.startDate),
      cargoOperation: {operation: this.form.value.cargoOperation},
      customer: {customerName: this.form.value.customer},
      signer: {initials: this.form.value.signer},
      comment: this.form.value.comment
    }).subscribe((data) => {
      this.memoOfDelivery = data;
      this.deliveryList = data.deliveryOfWagonList;
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Пямятка сохранена');
      this.form.markAsPristine();
      this.listDeliveryInMemoOfDeliveryComponent.loadSuitableDeliveries(this.memoOfDeliveryId);
    });
  }

  create(): void {
    if (this.utils.checkForm(this.alert, this.form, this.customers)) {
      return;
    }
    this.mSub = this.memoOfDeliveryService.create({
      ...this.memoOfDelivery,
      startDate: new Date(this.form.value.startDate),
      cargoOperation: {operation: this.form.value.cargoOperation},
      customer: {customerName: this.form.value.customer},
      comment: this.form.value.comment,
      // author: this.form.value.author,
    }).subscribe((data) => {
      this.memoOfDeliveryId = data.memoOfDeliveryId;
      this.memoOfDelivery = data;
      this.deliveryList.concat(data.deliveryOfWagonList);
      this.form.addControl('memoId', new FormControl(data.memoOfDeliveryId));
      this.form.addControl('created', new FormControl(new Date(data.created)));
      this.form.addControl('author', new FormControl(data.author));
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Памятка создана');
    });
  }
}
