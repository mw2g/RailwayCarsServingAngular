import {Pipe, PipeTransform} from '@angular/core';
import {MemoOfDelivery} from '../../shared/interfaces';

@Pipe({
  name: 'filterMemoOfDelivery'
})
export class FilterMemoOfDeliveryPipe implements PipeTransform {
  transform(
    memoOfDeliveryList: MemoOfDelivery[],
    search = '',
    cargoOperation = '',
    customer = ''
  ): MemoOfDelivery[] {

    if (search.trim()) {
      memoOfDeliveryList = memoOfDeliveryList.filter(memo => {
        return memo.memoOfDeliveryId.toString().includes(search.toLowerCase());
      });
    }

    if (cargoOperation) {
      memoOfDeliveryList = memoOfDeliveryList.filter(memo => {
        return memo.cargoOperation === cargoOperation;
      });
    }

    if (customer) {
      memoOfDeliveryList = memoOfDeliveryList.filter(memo => {
        return memo.customer.customerName === customer;
      });
    }

    return memoOfDeliveryList;
  }
}
