import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription, throwError} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {MemoOfDeliveryService} from '../memo-of-delivery.service';
import {Customer, MemoOfDelivery} from '../../shared/interfaces';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/customer.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-edit-memo-of-delivery',
  templateUrl: './form-memo-of-delivery.component.html',
  styleUrls: ['./form-memo-of-delivery.component.scss'],
  providers: [DatePipe]
})
export class FormMemoOfDeliveryComponent implements OnInit, OnDestroy {

  memoId: number;

  form: FormGroup;
  memoOfDelivery: MemoOfDelivery;
  submitted = false;

  mSub: Subscription;
  private customersSub: Subscription;
  private customers: Array<Customer>;

  constructor(
    private route: ActivatedRoute,
    private memoOfDeliveryService: MemoOfDeliveryService,
    private customerService: CustomerService,
    public router: Router,
    private alert: AlertService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.customersSub = this.customerService.getAllCustomers().subscribe(customers => {
      this.customers = customers;
    }, error => {
      throwError(error);
    });

    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['memoId']) {
          this.memoId = params['memoId'];
          return this.memoOfDeliveryService.getById(params['memoId']);
        } else {
          this.initEmptyForm();
          return new Observable<MemoOfDelivery>();
        }
      })
    ).subscribe((memoOfDelivery: MemoOfDelivery) => {
      this.memoOfDelivery = memoOfDelivery;
      this.form = new FormGroup({
        memoId: new FormControl(memoOfDelivery.memoId),
        created: new FormControl(memoOfDelivery.created, Validators.required),
        startDate: new FormControl(this.datePipe.transform(memoOfDelivery.startDate, 'yyyy-MM-ddTHH:mm')),
        cargoOperation: new FormControl(memoOfDelivery.cargoOperation.operationId, Validators.required),
        customer: new FormControl(memoOfDelivery.customer.customerName, Validators.required),
        author: new FormControl(memoOfDelivery.author, Validators.required),
        signer: new FormControl(memoOfDelivery.signer.initials),
        comment: new FormControl(memoOfDelivery.comment),
      });
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      startDate: new FormControl('', Validators.required),
      cargoOperation: new FormControl('', Validators.required),
      customer: new FormControl(''),
      signer: new FormControl(''),
      comment: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    if (this.mSub) {
      this.mSub.unsubscribe();
    }
  }

  update(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.mSub = this.memoOfDeliveryService.update({
      ...this.memoOfDelivery,
      startDate: new Date(this.form.value.startDate),
      cargoOperation: {operationId: this.form.value.cargoOperation},
      customer: {customerName: this.form.value.customer},
      signer: {initials: this.form.value.signer},
      comment: this.form.value.comment,
      // author: this.form.value.author,
    }).subscribe((data) => {
      this.alert.success(data.message);
      this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });

  }

  create(): void {
    // if (this.form.invalid) {
    //   return;
    // }

    this.submitted = true;
    this.mSub = this.memoOfDeliveryService.create({
      ...this.memoOfDelivery,
      startDate: new Date(this.form.value.startDate),
      cargoOperation: {operationId: this.form.value.cargoOperation},
      customer: {customerName: this.form.value.customer},
      comment: this.form.value.comment,
      // author: this.form.value.author,
    }).subscribe((data) => {
      this.alert.success('Памятка создана');
      this.memoId = data.memoId;
      this.memoOfDelivery = data;
      this.form.addControl('memoId', new FormControl(data.memoId));
      this.form.addControl('created', new FormControl(new Date(data.created)));
      this.form.addControl('author', new FormControl(data.author));
      this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });
  }
}
