import {Injectable, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AlertService} from './alert.service';
import {CargoType, Customer, DeliveryOfWagon, Statement, StatementRate, StatementWithRate} from '../interfaces';
import {CargoOperationService} from '../../reference/service/cargo-operation.service';
import {Observable, Subscription} from 'rxjs';
import {DeliveryOfWagonService} from '../../delivery-of-wagon/delivery-of-wagon.service';

@Injectable({providedIn: 'root'})
export class UtilsService implements OnDestroy {
  private baseRateAndPenaltySub: Subscription;

  constructor(private cargoOperationService: CargoOperationService,
              private deliveryService: DeliveryOfWagonService,
              private alert: AlertService
  ) {
  }

  prepareDate(date: Date, newDate: Date): Date {
    return date ? new Date(date) : newDate;
  }

  // sortList(list: Array<any>, sortState: Array<string>, field: string, fromMemory?): void {
  //   if (!fromMemory) {
  //     for (const key of Object.keys(sortState)) {
  //       sortState[key] = key === field ? !sortState[key] : null;
  //     }
  //   }
  //   const reverse = sortState[field] ? 1 : -1;
  //   list = [...list.sort((a, b) => {
  //     return a = a[field], b = b[field], reverse * (a > b ? 1 : -1);
  //   })];
  // }

  public unsubscribe(subscribes: Array<Subscription>): void {
    for (const subscribe of subscribes) {
      if (subscribe) {
        subscribe.unsubscribe();
      }
    }
  }

  public calculateDeliveries(statement: Statement, statementRate: StatementRate): DeliveryOfWagon[] {
    let deliveryList = [];
    statement.memoOfDispatchList.map(memo => {
      deliveryList = deliveryList.concat(memo.deliveryOfWagonList);
    });
    deliveryList.map(delivery => {
      const totalTime = (new Date(delivery.endDate).getTime() - new Date(delivery.startDate).getTime()) / 3600000;
      const exactCalculationTime = totalTime - statementRate.deliveryDispatchTimeNorm.norm;
      let calculationTime;
      if (exactCalculationTime > 0) {
        calculationTime = (exactCalculationTime % 1) >= 0.25 ? Math.ceil(exactCalculationTime) : Math.floor(exactCalculationTime);
      } else {
        calculationTime = 0;
      }
      const maxPayTime = statementRate.turnoverTimeNorm.norm - statementRate.deliveryDispatchTimeNorm.norm + 24;
      let payTime = calculationTime > maxPayTime ? maxPayTime : calculationTime;
      payTime = (payTime % 1) >= 0.25 ? Math.ceil(payTime) : Math.floor(payTime);

      if (delivery.owner === 'ВСП') {
        payTime = calculationTime;
      }

      let penaltyTime = calculationTime - payTime;
      const shuntingWorkTime = delivery.shuntingWorks != null ? delivery.shuntingWorks : 0;

      let paySum = 0;
      let penaltySum = 0;
      let shuntingWorkSum = 0;

      if (delivery.owner === 'Собств.(аренда)' || delivery.cargoType === 'ВЕСОПОВЕРОЧНЫЙ') {
        // calculationTime = 0;
        payTime = 0;
        paySum = 0;
        penaltyTime = 0;
        penaltySum = 0;
      }

      shuntingWorkSum = shuntingWorkTime * statementRate.shuntingTariff.tariff;

      if (payTime > 0) {
        this.baseRateAndPenaltySub = this.deliveryService
          .getBaseRateAndPenalty(delivery.deliveryId, payTime, statement.created).subscribe(data => {
            paySum = +(data.baseRate * statementRate.indexToBaseRate.indexToRate).toFixed(1);
            penaltySum = data.penalty * penaltyTime;
            // }, () => {
            //   this.alert.danger('Ошибка при загрузке базовой ставки и штрафа');
            // }, () => {

            if (delivery.owner === 'СНГ') {
              paySum = paySum * 1.3;
            }

            const totalSum = statementRate.deliveryDispatchTariff.tariff + paySum + penaltySum + shuntingWorkSum;

            delivery.calculation = {
              totalTime,
              calculationTime,
              payTime,
              paySum: +paySum.toFixed(1),
              penaltyTime,
              penaltySum,
              shuntingWorkTime,
              shuntingWorkSum,
              totalSum
            };

            // this.totalCost += totalSum;
          });
      } else {
        delivery.calculation = {
          totalTime,
          calculationTime,
          payTime: 0,
          paySum: 0,
          penaltyTime: 0,
          penaltySum: 0,
          shuntingWorkTime,
          shuntingWorkSum,
          totalSum: shuntingWorkSum + statementRate.deliveryDispatchTariff.tariff
        };
        // this.totalCost += shuntingWorkSum + statementRate.deliveryDispatchTariff.tariff;
      }

    });

    return deliveryList;
  }

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
    return false;
  }

  ngOnDestroy(): void {
    this.unsubscribe([this.baseRateAndPenaltySub]);
  }
}
