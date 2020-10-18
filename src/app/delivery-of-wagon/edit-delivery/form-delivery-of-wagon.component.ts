import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CargoOperation, CargoType, Customer, DeliveryOfWagon, Owner, User, WagonType} from '../../shared/interfaces';
import {Observable, Subscription, throwError} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {switchMap} from 'rxjs/operators';
import {DeliveryOfWagonService} from '../delivery-of-wagon.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../shared/service/utils.service.';
import {WagonTypeService} from '../../reference/service/wagon-type.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';

@Component({
  selector: 'app-form-delivery-of-wagon',
  templateUrl: './form-delivery-of-wagon.component.html',
  styleUrls: ['./form-delivery-of-wagon.component.scss'],
  providers: [DatePipe]
})
export class FormDeliveryOfWagonComponent implements OnInit, OnDestroy {

  form: FormGroup;
  delivery: DeliveryOfWagon;
  customers: Customer[] = [];
  cargoTypeList: CargoType [] = [];
  wagonTypeList: WagonType [] = [];
  ownersList: Owner[] = [];
  uSub: Subscription;
  customersSub: Subscription;
  cargoTypeSub: Subscription;
  wagonTypeSub: Subscription;
  ownerSub: Subscription;

  private cargoOperations: Array<CargoOperation>;
  private cargoOperationSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private deliveryOfWagonService: DeliveryOfWagonService,
    private wagonTypeService: WagonTypeService,
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

    this.customersSub = this.customerService.getAll().subscribe(data => {
      this.customers = data;
    }, error => {
      throwError(error);
    });

    this.wagonTypeSub = this.wagonTypeService.getAll().subscribe(data => {
      this.wagonTypeList = data;
    }, error => {
      throwError(error);
    });

    this.cargoTypeSub = this.deliveryOfWagonService.getAllCargoTypes().subscribe(data => {
      this.cargoTypeList = data;
    }, error => {
      throwError(error);
    });

    this.ownerSub = this.deliveryOfWagonService.getAllOwners().subscribe(data => {
      this.ownersList = data;
    }, error => {
      throwError(error);
    });

    // this.cargoOperationList = this.cargoOperationService.getAllCargoOperations();
    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params.deliveryId) {
          return this.deliveryOfWagonService.getById(params.deliveryId);
        } else {
          this.initEmptyForm();
          return new Observable<User>();
        }
      })
    ).subscribe((delivery: DeliveryOfWagon) => {
      this.delivery = delivery;
      this.loadForm();
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      deliveryId: new FormControl(this.delivery.deliveryId, Validators.required),
      created: new FormControl(this.delivery.created, Validators.required),
      wagonNumber: new FormControl(this.delivery.wagon.wagonNumber, Validators.required),
      wagonType: new FormControl(this.delivery.wagonType ? this.delivery.wagonType.typeName : '', Validators.required),
      owner: new FormControl(this.delivery.owner ? this.delivery.owner.owner : ''),
      cargoType: new FormControl(this.delivery.cargoType ? this.delivery.cargoType.typeName : '', Validators.required),
      customer: new FormControl(this.delivery.customer.customerName, Validators.required),
      startDate: new FormControl(this.datePipe.transform(this.delivery.startDate, 'yyyy-MM-ddTHH:mm'), Validators.required),
      endDate: new FormControl(this.datePipe.transform(this.delivery.endDate, 'yyyy-MM-ddTHH:mm')),
      cargoOperation: new FormControl(this.delivery.cargoOperation.operationId, Validators.required),
      cargoWeight: new FormControl(this.delivery.cargoWeight),
      loadUnloadWork: new FormControl(this.delivery.loadUnloadWork, Validators.required),
      shuntingWork: new FormControl(this.delivery.shuntingWork),
      memoOfDelivery: new FormControl(this.delivery.memoOfDelivery ? this.delivery.memoOfDelivery.memoOfDeliveryId : ''),
      memoOfDispatch: new FormControl(this.delivery.memoOfDispatch ? this.delivery.memoOfDispatch.memoOfDispatchId : ''),
      author: new FormControl(this.delivery.author)
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      wagonNumber: new FormControl('', Validators.required),
      wagonType: new FormControl('', Validators.required),
      owner: new FormControl('', Validators.required),
      cargoType: new FormControl('', Validators.required),
      customer: new FormControl('', Validators.required),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      cargoOperation: new FormControl('1'),
      cargoWeight: new FormControl(''),
      loadUnloadWork: new FormControl(false, Validators.required),
      shuntingWork: new FormControl(''),
      memoOfDelivery: new FormControl(''),
      memoOfDispatch: new FormControl('')
    });
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

  update(): void {
    if (this.utils.checkForm(this.alert, this.form, this.customers, this.cargoTypeList)) {
      return;
    }

    this.uSub = this.deliveryOfWagonService.update({
      ...this.delivery,
      wagon: {wagonNumber: this.form.value.wagonNumber},
      wagonType: {typeName: this.form.value.wagonType},
      owner: {owner: this.form.value.owner},
      customer: {customerName: this.form.value.customer},
      startDate: this.prepareDate(this.form.value.startDate),
      endDate: this.prepareDate(this.form.value.endDate),
      cargoOperation: {operationId: this.form.value.cargoOperation},
      cargoType: {typeName: this.form.value.cargoType},
      cargoWeight: this.form.value.cargoWeight,
      loadUnloadWork: this.form.value.loadUnloadWork,
      shuntingWork: this.form.value.shuntingWork,
      memoOfDelivery: {memoOfDeliveryId: this.form.value.memoOfDelivery},
      memoOfDispatch: {memoOfDispatchId: this.form.value.memoOfDispatch}
    }).subscribe((data) => {
      this.delivery = data;
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Общая подача обновлена');
      this.form.markAsPristine();
    });
  }

  prepareDate(date: Date): Date {
    return date ? new Date(date) : date;
  }

  create(): void {
    if (this.utils.checkForm(this.alert, this.form, this.customers, this.cargoTypeList)) {
      return;
    }

    this.uSub = this.deliveryOfWagonService.create({
      ...this.delivery,
      wagon: {wagonNumber: this.form.value.wagonNumber},
      wagonType: {typeName: this.form.value.wagonType},
      owner: {owner: this.form.value.owner},
      customer: {customerName: this.form.value.customer},
      startDate: this.prepareDate(this.form.value.startDate),
      endDate: this.prepareDate(this.form.value.endDate),
      cargoOperation: {operationId: this.form.value.cargoOperation},
      cargoType: {typeName: this.form.value.cargoType},
      cargoWeight: this.form.value.cargoWeight,
      loadUnloadWork: this.form.value.loadUnloadWork,
      shuntingWork: this.form.value.shuntingWork,
      memoOfDelivery: {memoOfDeliveryId: this.form.value.memoOfDelivery}
    }).subscribe((data) => {
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Общая подача создана');
      this.form.markAsPristine();
    });
  }

  autocomplete(): void {
    // const length = this.form.get('wagonNumber').value.length;
    const wagonNumber = this.form.value.wagonNumber;
    if (wagonNumber.length > 5) {
      this.deliveryOfWagonService.getDeliveryForAutocomplete(this.form.value.wagonNumber).subscribe(data => {
        if (data.wagon) {
          this.form.get('customer').setValue(data.customer.customerName);
          this.form.get('owner').setValue(data.owner.owner);
          this.form.get('wagonType').setValue(data.wagonType.typeName);
          this.form.get('cargoType').setValue(data.cargoType.typeName);
        }
      });
    }
  }
}
