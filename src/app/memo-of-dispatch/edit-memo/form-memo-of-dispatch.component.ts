import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {MemoOfDispatchService} from '../memo-of-dispatch.service';
import {CargoOperation, Customer, DeliveryOfWagon, MemoOfDispatch} from '../../shared/interfaces';
import {AlertService} from '../../shared/service/alert.service';
import {CustomerService} from '../../reference/service/customer.service';
import {DatePipe} from '@angular/common';
import {UtilsService} from '../../shared/service/utils.service';
import {ListDeliveryInMemoOfDispatchComponent} from '../list-delivery-in-memo-of-dispatch/list-delivery-in-memo-of-dispatch.component';
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

  private customers: Observable<Array<Customer>>;
  private cargoOperations: Observable<Array<CargoOperation>>;
  private createSub: Subscription;
  private updateSub: Subscription;
  private loadSub: Subscription;
  enableComment = true;

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
    this.cargoOperations = this.cargoOperationService.getAll();
    this.customers = this.customerService.getAll();

    this.loadSub = this.route.params.pipe(
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
      this.enableComment = !!memoOfDispatch.comment;
      this.loadForm();
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      memoOfDispatchId: new FormControl(this.memoOfDispatch.memoOfDispatchId),
      statement: new FormControl(this.memoOfDispatch.statement),
      created: new FormControl(this.datePipe.transform(this.memoOfDispatch.created, 'yyyy-MM-ddTHH:mm'), Validators.required),
      endDate: new FormControl(this.datePipe.transform(this.memoOfDispatch.endDate, 'yyyy-MM-ddTHH:mm'), Validators.required),
      cargoOperation: new FormControl(this.memoOfDispatch.cargoOperation, Validators.required),
      customer: new FormControl(this.memoOfDispatch.customer.customerName, Validators.required),
      author: new FormControl(this.memoOfDispatch.author),
      signer: new FormControl(this.memoOfDispatch.signer),
      comment: new FormControl(this.memoOfDispatch.comment),
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      endDate: new FormControl('', Validators.required),
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
    this.updateSub = this.memoOfDispatchService.update({
      ...this.memoOfDispatch,
      // created: new Date(this.form.value.created),
      endDate: new Date(this.form.value.endDate),
      cargoOperation: this.form.value.cargoOperation,
      customer: {customerName: this.form.value.customer},
      signer: this.form.value.signer,
      comment: this.form.value.comment,
      statement: this.form.value.statement,
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
    this.createSub = this.memoOfDispatchService.create({
      ...this.memoOfDispatch,
      endDate: new Date(this.form.value.endDate),
      cargoOperation: this.form.value.cargoOperation,
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
      this.form.addControl('statement', new FormControl(data.statement));
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Памятка создана');
    });
  }

  clearComment(): void {
    this.form.get('comment').reset();
    this.enableComment = false;
    if (this.memoOfDispatch.comment) {
      this.form.markAsDirty();
    }
  }

  ngOnDestroy(): void {
    this.utils.unsubscribe([
      this.createSub,
      this.updateSub,
      this.loadSub
    ]);
  }
}
