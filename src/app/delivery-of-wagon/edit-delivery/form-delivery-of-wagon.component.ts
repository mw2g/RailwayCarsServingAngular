import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Customer, DeliveryOfWagon, User} from '../../shared/interfaces';
import {Observable, Subscription, throwError} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {switchMap} from 'rxjs/operators';
import {DeliveryOfWagonService} from '../delivery-of-wagon.service';
import {CustomerService} from '../../reference/customer.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-form-delivery-of-wagon',
  templateUrl: './form-delivery-of-wagon.component.html',
  styleUrls: ['./form-delivery-of-wagon.component.scss'],
  providers: [DatePipe]
})
export class FormDeliveryOfWagonComponent implements OnInit, OnDestroy {

  form: FormGroup;
  delivery: DeliveryOfWagon;
  submitted = false;
  customers: Customer[] = [];
  uSub: Subscription;
  customersSub: Subscription;

  // cargoOperationList: CargoOperation[] = [];

  constructor(
    private route: ActivatedRoute,
    private deliveryOfWagonService: DeliveryOfWagonService,
    private customerService: CustomerService,
    // private cargoOperationService: CargoOperationService,
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
    // this.cargoOperationList = this.cargoOperationService.getAllCargoOperations();
    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['deliveryId']) {
          return this.deliveryOfWagonService.getById(params['deliveryId']);
        } else {
          this.initEmptyForm();
          return new Observable<User>();
        }
      })
    ).subscribe((delivery: DeliveryOfWagon) => {
      this.delivery = delivery;
      this.form = new FormGroup({
        deliveryId: new FormControl(delivery.deliveryId, Validators.required),
        created: new FormControl(delivery.created, Validators.required),
        wagon: new FormControl(delivery.wagon.wagonNumber, Validators.required),
        customer: new FormControl(delivery.customer.customerName, Validators.required),
        startDate: new FormControl(this.datePipe.transform(delivery.startDate, 'yyyy-MM-ddTHH:mm'), Validators.required),
        endDate: new FormControl(this.datePipe.transform(delivery.endDate, 'yyyy-MM-ddTHH:mm'), Validators.required),
        cargoOperation: new FormControl(delivery.cargoOperation.operationId, Validators.required),
        cargoWeight: new FormControl(delivery.cargoWeight, Validators.required),
        loadUnloadWork: new FormControl(delivery.loadUnloadWork, Validators.required),
        shuntingWork: new FormControl(delivery.shuntingWork, Validators.required),
        memoOfDelivery: new FormControl(delivery.memoOfDelivery ? delivery.memoOfDelivery.memoId : '', Validators.required),
        author: new FormControl(delivery.author, Validators.required)
      });
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      wagon: new FormControl('', Validators.required),
      customer: new FormControl('', Validators.required),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      cargoOperation: new FormControl('1'),
      cargoWeight: new FormControl(''),
      loadUnloadWork: new FormControl(false, Validators.required),
      shuntingWork: new FormControl(''),
      memoOfDelivery: new FormControl('')
    });
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

  update(): void {
    // if (this.form.invalid) {
    //   return;
    // }

    this.submitted = true;
    this.uSub = this.deliveryOfWagonService.update({
      ...this.delivery,
      wagon: {wagonNumber: this.form.value.wagon},
      customer: {customerName: this.form.value.customer},
      startDate: this.prepareDate(this.form.value.startDate),
      endDate: this.prepareDate(this.form.value.endDate),
      cargoOperation: {operationId: this.form.value.cargoOperation},
      cargoWeight: this.form.value.cargoWeight,
      loadUnloadWork: this.form.value.loadUnloadWork,
      shuntingWork: this.form.value.shuntingWork,
      memoOfDelivery: {memoId: this.form.value.memoOfDelivery}
    }).subscribe((data) => {
      this.alert.success(data.message);
      this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });

  }

  prepareDate(date: Date): Date {
    return date ? new  Date(date) : date;
  }

  create(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.uSub = this.deliveryOfWagonService.create({
      ...this.delivery,
      wagon: {wagonNumber: this.form.value.wagon},
      customer: {customerName: this.form.value.customer},
      startDate: this.prepareDate(this.form.value.startDate),
      endDate: this.prepareDate(this.form.value.endDate),
      cargoOperation: {operationId: this.form.value.cargoOperation},
      cargoWeight: this.form.value.cargoWeight,
      loadUnloadWork: this.form.value.loadUnloadWork,
      shuntingWork: this.form.value.shuntingWork,
      memoOfDelivery: {memoId: this.form.value.memoOfDelivery}
    }).subscribe((data) => {
      this.alert.success(data.message);
      this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });
  }
}
