import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {CargoOperation, Customer, DeliveryOfWagon, MemoOfDelivery} from '../../shared/interfaces';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../shared/service/utils.service';
import {ListDeliveryInMemoOfDeliveryComponent} from '../list-delivery-in-memo-of-delivery/list-delivery-in-memo-of-delivery.component';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';

@Component({
  selector: 'app-edit-statement',
  templateUrl: './form-memo-of-delivery.component.html',
  styleUrls: ['./form-memo-of-delivery.component.scss'],
  providers: [DatePipe]
})
export class FormMemoOfDeliveryComponent implements OnInit, OnDestroy {

  @ViewChild(ListDeliveryInMemoOfDeliveryComponent) listDeliveryInMemoOfDeliveryComponent: ListDeliveryInMemoOfDeliveryComponent;
  memoOfDeliveryId: number;
  deliveryList: Array<DeliveryOfWagon> = [];
  memoOfDelivery: MemoOfDelivery;
  enableComment = true;

  form: FormGroup;

  private customers: Observable<Array<Customer>>;
  private cargoOperations: Observable<Array<CargoOperation>>;
  private loadSub: Subscription;
  private createSub: Subscription;
  private updateSub: Subscription;

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
    this.cargoOperations = this.cargoOperationService.getAll();
    this.customers = this.customerService.getAll();

    this.loadSub = this.route.params.pipe(
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
      this.enableComment = !!memoOfDelivery.comment;
      this.loadForm();
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      memoOfDeliveryId: new FormControl(this.memoOfDelivery.memoOfDeliveryId),
      created: new FormControl(this.memoOfDelivery.created, Validators.required),
      startDate: new FormControl(this.datePipe.transform(this.memoOfDelivery.startDate, 'yyyy-MM-ddTHH:mm'), Validators.required),
      cargoOperation: new FormControl(this.memoOfDelivery.cargoOperation, Validators.required),
      customer: new FormControl(this.memoOfDelivery.customer.customerName, Validators.required),
      author: new FormControl(this.memoOfDelivery.author),
      signer: new FormControl(this.memoOfDelivery.signer),
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

  update(): void {
    if (this.form.invalid) {
      this.alert.warning('Форма невалидна');
      return;
    }
    this.updateSub = this.memoOfDeliveryService.update({
      ...this.memoOfDelivery,
      startDate: new Date(this.form.value.startDate),
      cargoOperation: this.form.value.cargoOperation,
      customer: {customerName: this.form.value.customer},
      signer: this.form.value.signer,
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
    if (this.form.invalid) {
      this.alert.warning('Форма невалидна');
      return;
    }
    this.createSub = this.memoOfDeliveryService.create({
      ...this.memoOfDelivery,
      startDate: new Date(this.form.value.startDate),
      cargoOperation: this.form.value.cargoOperation,
      customer: {customerName: this.form.value.customer}
    }).subscribe((data) => {
      this.memoOfDeliveryId = data.memoOfDeliveryId;
      this.memoOfDelivery = data;
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Памятка создана');
      this.form.markAsPristine();
    });
  }

  clearComment(): void {
    this.form.get('comment').reset();
    this.enableComment = false;
    if (this.memoOfDelivery.comment) {
      this.form.markAsDirty();
    }
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.loadSub,
      this.createSub,
      this.updateSub
    ]);
  }
}
