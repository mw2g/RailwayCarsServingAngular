import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CargoOperation, CargoType, Customer, DeliveryOfWagon, Owner, User, WagonType} from '../../shared/interfaces';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AlertService} from '../../shared/service/alert.service';
import {switchMap} from 'rxjs/operators';
import {DeliveryOfWagonService} from '../delivery-of-wagon.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {WagonTypeService} from '../../reference/service/wagon-type.service';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UtilsService} from '../../shared/service/utils.service';

@Component({
  selector: 'app-form-delivery-of-wagon',
  templateUrl: './form-delivery-of-wagon.component.html',
  styleUrls: ['./form-delivery-of-wagon.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class FormDeliveryOfWagonComponent implements OnInit, OnDestroy {

  form: FormGroup;
  delivery: DeliveryOfWagon;
  cargoOperations: Observable<Array<CargoOperation>>;
  customers: Observable<Array<Customer>>;
  wagonTypeList: Observable<Array<WagonType>>;
  cargoTypeList: Observable<Array<CargoType>>;
  ownersList: Observable<Array<Owner>>;
  createSub: Subscription;
  updateSub: Subscription;
  loadSub: Subscription;
  autocompleteSub: Subscription;
  delSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryOfWagonService,
    private wagonTypeService: WagonTypeService,
    private customerService: CustomerService,
    private cargoOperationService: CargoOperationService,
    public router: Router,
    private alert: AlertService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.cargoOperations = this.cargoOperationService.getAll();
    this.customers = this.customerService.getAll();
    this.wagonTypeList = this.wagonTypeService.getAll();
    this.cargoTypeList = this.deliveryService.getAllCargoTypes();
    this.ownersList = this.deliveryService.getAllOwners();

    this.loadSub = this.route.params.pipe(
      switchMap((params: Params) => {
        if (params.deliveryId) {
          return this.deliveryService.getById(params.deliveryId);
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

  initEmptyForm(): void {
    this.form = new FormGroup({
      wagonNumber: new FormControl('', Validators.required),
      wagonType: new FormControl('', Validators.required),
      owner: new FormControl('', Validators.required),
      cargoType: new FormControl('', Validators.required),
      customer: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl(''),
      cargoOperation: new FormControl('', Validators.required),
      cargoWeight: new FormControl(''),
      loadUnloadWork: new FormControl(false, Validators.required),
      shuntingWorks: new FormControl(''),
      memoOfDelivery: new FormControl(''),
      memoOfDispatch: new FormControl(''),
      statement: new FormControl('')
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      deliveryId: new FormControl(this.delivery.deliveryId),
      created: new FormControl(this.delivery.created),
      wagonNumber: new FormControl(this.delivery.wagon, Validators.required),
      wagonType: new FormControl(this.delivery.wagonType ? this.delivery.wagonType : '', Validators.required),
      owner: new FormControl(this.delivery.owner ? this.delivery.owner : '', Validators.required),
      cargoType: new FormControl(this.delivery.cargoType ? this.delivery.cargoType : '', Validators.required),
      customer: new FormControl(this.delivery.customer, Validators.required),
      startDate: new FormControl(this.datePipe.transform(this.delivery.startDate, 'yyyy-MM-ddTHH:mm')),
      endDate: new FormControl(this.datePipe.transform(this.delivery.endDate, 'yyyy-MM-ddTHH:mm')),
      cargoOperation: new FormControl(this.delivery.cargoOperation, Validators.required),
      cargoWeight: new FormControl(this.decimalPipe.transform(this.delivery.cargoWeight, '0.2')),
      loadUnloadWork: new FormControl(this.delivery.loadUnloadWork, Validators.required),
      shuntingWorks: new FormControl(this.delivery.shuntingWorks === 0 ? '' :
        this.decimalPipe.transform(this.delivery.shuntingWorks, '0.2')),
      memoOfDelivery: new FormControl(this.delivery.memoOfDelivery ? this.delivery.memoOfDelivery : ''),
      memoOfDispatch: new FormControl(this.delivery.memoOfDispatch ? this.delivery.memoOfDispatch : ''),
      statement: new FormControl(
        {value: this.delivery.memoOfDispatch ? this.delivery.memoOfDispatch : '', disabled: true}),
      author: new FormControl(this.delivery.author)
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.alert.warning('Форма невалидна');
      return;
    }

    this.createSub = this.deliveryService.create({
      ...this.delivery,
      wagon: this.form.value.wagonNumber,
      wagonType: this.form.value.wagonType,
      owner: this.form.value.owner,
      customer: this.form.value.customer,
      startDate: this.prepareDate(this.form.value.startDate),
      endDate: this.prepareDate(this.form.value.endDate),
      cargoOperation: this.form.value.cargoOperation,
      cargoType: this.form.value.cargoType,
      cargoWeight: this.form.value.cargoWeight,
      loadUnloadWork: this.form.value.loadUnloadWork,
      shuntingWorks: this.form.value.shuntingWorks,
      memoOfDelivery: this.form.value.memoOfDelivery
    }).subscribe((data) => {
      this.delivery = data;
    }, (error) => {
      if (error instanceof HttpErrorResponse
        && error.status === 423) {
        this.alert.danger('Подача с таким номером вагона и датой подачи уже существует');
      } else {
        this.alert.danger('Ошибка');
      }
    }, () => {
      this.alert.success('Общая подача создана');
      this.form.markAsPristine();
    });
  }

  update(): void {
    if (this.form.invalid) {
      this.alert.warning('Форма невалидна');
      return;
    }

    this.updateSub = this.deliveryService.update({
      ...this.delivery,
      wagon: this.form.value.wagonNumber,
      wagonType: this.form.value.wagonType,
      owner: this.form.value.owner,
      customer: this.form.value.customer,
      startDate: this.prepareDate(this.form.value.startDate),
      endDate: this.prepareDate(this.form.value.endDate),
      cargoOperation: this.form.value.cargoOperation,
      cargoType: this.form.value.cargoType,
      cargoWeight: this.form.value.cargoWeight,
      loadUnloadWork: this.form.value.loadUnloadWork,
      shuntingWorks: this.form.value.shuntingWorks,
      memoOfDelivery: this.form.value.memoOfDelivery,
      memoOfDispatch: this.form.value.memoOfDispatch
    }).subscribe((data) => {
      this.delivery = data;
    }, (error) => {
      if (error instanceof HttpErrorResponse
        && error.status === 423) {
        this.alert.danger('Подача с таким номером вагона и датой подачи уже существует');
      } else {
        this.alert.danger('Ошибка');
      }
    }, () => {
      this.alert.success('Общая подача обновлена');
      this.form.markAsPristine();
    });
  }

  prepareDate(date: Date): Date {
    return date ? new Date(date) : date;
  }

  autocomplete(): void {
    const wagonNumber = this.form.value.wagonNumber;
    if (wagonNumber.length > 5) {
      this.autocompleteSub = this.deliveryService.getDeliveryForAutocomplete(this.form.value.wagonNumber).subscribe(data => {
        if (data.wagon) {
          this.form.get('customer').setValue(data.customer);
          this.form.get('owner').setValue(data.owner);
          this.form.get('wagonType').setValue(data.wagonType);
          this.form.get('cargoType').setValue(data.cargoType);
        }
      });
    }
  }

  delete(deliveryId: number): void {
    this.delSub = this.deliveryService.delete(deliveryId).subscribe((data) => {
      // this.alert.success(data.message);
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Общая подача удалена');
      this.router.navigate(['/delivery']);
    });
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.createSub,
      this.updateSub,
      this.loadSub,
      this.delSub,
      this.autocompleteSub
    ]);
  }
}
