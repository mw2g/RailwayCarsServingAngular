import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Customer, Signer, User} from '../../../shared/interfaces';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {switchMap} from 'rxjs/operators';
import {CustomerService} from '../../service/customer.service';
import {UtilsService} from '../../../shared/service/utils.service.';
import {ListSignerInCustomerComponent} from '../list-signer-in-customer/list-signer-in-customer.component';

@Component({
  selector: 'app-form-customer-of-wagon',
  templateUrl: './form-customer.component.html',
  styleUrls: ['./form-customer.component.scss']
})
export class FormCustomerComponent implements OnInit, OnDestroy {

  @ViewChild(ListSignerInCustomerComponent) listSignerInCustomerComponent: ListSignerInCustomerComponent;

  form: FormGroup;
  customer: Customer;
  customerId: number;
  signers: Signer[];

  uSub: Subscription;
  cSub: Subscription;
  iSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public router: Router,
    private alert: AlertService,
    private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.iSub = this.route.params.pipe(
      switchMap((params: Params) => {
        if (params.customerId) {
          this.customerId = params.customerId;
          return this.customerService.getById(params.customerId);
        } else {
          this.initEmptyForm();
          return new Observable<User>();
        }
      })
    ).subscribe((customer: Customer) => {
      this.customer = customer;
      this.signers = customer.signerList;
      this.form = new FormGroup({
        customerId: new FormControl(customer.customerId),
        created: new FormControl(customer.created),
        author: new FormControl(customer.author),
        customerName: new FormControl(customer.customerName, Validators.required),
        customerFullName: new FormControl(customer.customerFullName, Validators.required)
      });
    });
  }

  loadForm(): void {
    this.form = new FormGroup({
      customerId: new FormControl(this.customer.customerId),
      created: new FormControl(this.customer.created, Validators.required),
      customerName: new FormControl(this.customer.customerName, Validators.required),
      customerFullName: new FormControl(this.customer.customerFullName, Validators.required),
      author: new FormControl(this.customer.author)
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      customerName: new FormControl('', Validators.required),
      customerFullName: new FormControl('', Validators.required),
    });
  }

  update(): void {
    if (this.form.invalid) {
      this.alert.warning('Форма невалидна');
      this.utils.markFormGroupTouched(this.form);
      return;
    }
    this.uSub = this.customerService.update({
      ...this.customer,
      customerName: this.form.value.customerName,
      customerFullName: this.form.value.customerFullName
    }).subscribe((data) => {
      this.alert.success(data.message);
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.customer.customerName = this.form.value.customerName;
      this.customer.customerFullName = this.form.value.customerFullName;
      this.form.markAsPristine();
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.alert.warning('Форма невалидна');
      this.utils.markFormGroupTouched(this.form);
      return;
    }
    this.cSub = this.customerService.create({
      customerName: this.form.value.customerName,
      customerFullName: this.form.value.customerFullName
    }).subscribe((data) => {
      this.customer = data;
      this.customerId = data.customerId;
      this.signers = data.signerList;
      this.form.addControl('customerId', new FormControl(data.customerId));
      this.form.addControl('created', new FormControl(new Date(data.created)));
      this.form.addControl('author', new FormControl(data.author));
      this.alert.success('Контрагент создан');
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.form.markAsPristine();
    });
  }

  ngOnDestroy(): void {
    if (this.iSub) {
      this.iSub.unsubscribe();
    }
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
