import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Customer, Signer, User} from '../../../shared/interfaces';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AlertService} from '../../../shared/service/alert.service';
import {switchMap} from 'rxjs/operators';
import {CustomerService} from '../../customer.service';

@Component({
  selector: 'app-form-customer-of-wagon',
  templateUrl: './form-customer.component.html',
  styleUrls: ['./form-customer.component.scss']
})
export class FormCustomerComponent implements OnInit, OnDestroy {

  form: FormGroup;
  customer: Customer;
  submitted = false;
  signers: Signer[];

  uSub: Subscription;
  customerId: number;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public router: Router,
    private alert: AlertService
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['customerId']) {
          this.customerId = params['customerId'];
          return this.customerService.getById(params['customerId']);
        } else {
          this.initEmptyForm();
          return new Observable<User>();
        }
      })
    ).subscribe((customer: Customer) => {
      this.signers = customer.signerList;
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

  initEmptyForm(): void {
    this.form = new FormGroup({
      customerName: new FormControl('', Validators.required),
      customerFullName: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

  update(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.uSub = this.customerService.update({
      ...this.customer,
      customerName: this.form.value.customerName
    }).subscribe((data) => {
      this.alert.success(data.message);
      this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });

  }

  create(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.uSub = this.customerService.create({
      customerName: this.form.value.customerName,
      customerFullName: this.form.value.customerFullName
    }).subscribe((data) => {
      this.customerId = data.customerId;
      this.signers = data.signerList;
      this.form.addControl('customerId', new FormControl(data.customerId));
      this.form.addControl('created', new FormControl(new Date(data.created)));
      this.form.addControl('author', new FormControl(data.author));
      this.alert.success("Контрагент создан");
      this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });
  }
}
