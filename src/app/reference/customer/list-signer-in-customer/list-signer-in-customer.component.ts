import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {Customer, Signer} from '../../../shared/interfaces';
import {CustomerService} from '../../customer.service';
import {AlertService} from '../../../shared/service/alert.service';
import {SignerService} from '../../signer.service';

@Component({
  selector: 'app-signer-in-customer',
  templateUrl: './list-signer-in-customer.component.html',
  styleUrls: ['./list-signer-in-customer.component.scss']
})
export class ListSignerInCustomerComponent implements OnInit, OnDestroy {

  @ViewChild('readTemplate', {static: false}) readTemplate: TemplateRef<any>;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any>;

  @Input() signers: Signer[];
  @Input() customerId: number;

  signerIdToDelete: number;
  customerSub: Subscription;
  delSub: Subscription;


  editedSigner: Signer;
  isNewRecord: boolean;

  private createSub: Subscription;
  private updateSub: Subscription;
  private customersSub: Subscription;

  constructor(private customerService: CustomerService,
              private signerService: SignerService,
              private router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.customerSub) {
      this.customerSub.unsubscribe();
    }
    if (this.createSub) {
      this.createSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
  }

  // загружаем один из двух шаблонов
  loadTemplate(signer: Signer): TemplateRef<any> {
    if (this.editedSigner && this.editedSigner.signerId === signer.signerId) {
      return this.editTemplate;
    } else {
      return this.readTemplate;
    }
  }

  // добавление пользователя
  addSigner(): void {
    this.editedSigner = {
      signerId: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      customerId: this.customerId,
    };
    this.signers.push(this.editedSigner);
    this.isNewRecord = true;
  }

  // редактирование пользователя
  editDelivery(signer: Signer): void {
    this.isNewRecord = false;
    this.editedSigner = {
      signerId: signer.signerId,
      firstName: signer.firstName,
      middleName: signer.middleName,
      lastName: signer.lastName,
      customerId: signer.customerId
    };
  }

  // отмена редактирования
  cancel(): void {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.signers.pop();
      this.isNewRecord = false;
    }
    this.editedSigner = null;
  }

  // сохраняем пользователя
  saveSigner(): void {
    if (this.isNewRecord) {
      // добавляем пользователя
      this.createSub = this.signerService.create(this.editedSigner).subscribe((data: { message: string }) => {
        this.alert.success(data.message);
      }, () => {
        this.alert.danger('Ошибка');
      });
      this.isNewRecord = false;
      this.editedSigner = null;
    } else {
      // изменяем пользователя
      this.updateSub = this.signerService.update(this.editedSigner).subscribe((data) => {
        this.alert.success(data.message);
        // this.submitted = true;
      }, () => {
        this.alert.danger('Ошибка');
      });
    }
    this.editedSigner = null;
  }

  delete(): void {
    this.delSub = this.signerService.delete(this.signerIdToDelete).subscribe((data) => {
      this.alert.success(data.message);
      this.signers = this.signers.filter(signer => signer.signerId !== this.signerIdToDelete);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Пользователь удален');
    });
  }

  setDelete(signerId: number): void {
    this.signerIdToDelete = signerId;
  }

  unsetDelete(): void {
    this.signerIdToDelete = null;
  }

  getById(signerId: number): number {
    if (signerId) {
      return this.signers.find(value => value.signerId === signerId).signerId;
    }
    return 0;
  }
}
