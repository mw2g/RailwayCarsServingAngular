import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AlertService} from './alert.service';
import {CargoOperation, CargoType, Customer} from '../interfaces';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {throwError} from 'rxjs';
import {newArray} from '@angular/compiler/src/util';
import {delay} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UtilsService {
  constructor(private cargoOperationService: CargoOperationService) {
  }

  // getCargoOperations(): Array<CargoOperation> {
  //   let operations: Array<CargoOperation> = new Array<CargoOperation>();
  //   this.cargoOperationService.getAll().subscribe(data => {
  //     operations = data;
  //   }, error => {
  //     throwError(error);
  //   }, () => {
  //     console.log(operations);
  //   });
  //   return operations;
  // }

  /**
   * Marks all controls in a form group as touched
   */
  public markFormGroupTouched(form: FormGroup): void {
    (Object as any).values(form.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  checkForm(alert: AlertService, form: FormGroup, customers?: Array<Customer>, cargoTypeList?: Array<CargoType>): boolean {
    if (form.invalid) {
      alert.warning('Форма невалидна');
      return true;
    }
    if (customers && !customers.find(customer => customer.customerName === form.value.customer)) {
      alert.warning('Неверный ввод контрагента');
      form.get('customer').setValue('');
      return true;
    }
    if (cargoTypeList && !cargoTypeList.find(cargoType => cargoType.typeName === form.value.cargoType)) {
      alert.warning('Неверный ввод вида груза');
      form.get('cargoType').setValue('');
      return true;
    }
    return false;
  }

  checkCargoType(form: FormGroup, cargoTypeList: Array<CargoType>, alert: AlertService): boolean {
    if (!cargoTypeList.find(cargoType => cargoType.typeName === form.value.cargoType)) {
      alert.warning('Неверный ввод вида груза');
      form.get('cargoType').setValue('');
      return true;
    }
    return false;
  }

}
