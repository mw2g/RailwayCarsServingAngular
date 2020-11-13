import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AlertService} from './alert.service';
import {CargoType, Customer} from '../interfaces';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {Observable, Subscription} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UtilsService {
  constructor(private cargoOperationService: CargoOperationService) {
  }

  public unsubscribe(subscribes: Array<Subscription>): void {
    for (const subscribe of subscribes) {
      if (subscribe) {
        subscribe.unsubscribe();
      }
    }
  }

  // getCargoOperations(cargoOperations: Array<CargoOperation>): void {
  //   let operations: Array<CargoOperation> = new Array<CargoOperation>();
  //   this.cargoOperationService.getAll().subscribe(data => {
  //     operations = data;
  //   }, error => {
  //     cargoOperations = null;
  //     throwError(error);
  //   }, () => {
  //     cargoOperations = operations;
  //     console.log(operations);
  //   });
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

  checkForm(alert: AlertService, form: FormGroup, customers?: Observable<Array<Customer>>, cargoTypeList?: Observable<Array<CargoType>>):
    boolean {
    if (form.invalid) {
      alert.warning('Форма невалидна');
      return true;
    }
    // if (customers && !customers.find(customer => customer.customerName === form.value.customer)) {
    //   alert.warning('Неверный ввод контрагента');
    //   form.get('customer').setValue('');
    //   return true;
    // }
    // if (cargoTypeList && !cargoTypeList.find(cargoType => cargoType.typeName === form.value.cargoType)) {
    //   alert.warning('Неверный ввод вида груза');
    //   form.get('cargoType').setValue('');
    //   return true;
    // }
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
