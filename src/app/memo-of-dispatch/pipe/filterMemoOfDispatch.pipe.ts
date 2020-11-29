import {Pipe, PipeTransform} from '@angular/core';
import {DeliveryOfWagon, MemoOfDispatch} from '../../shared/interfaces';

@Pipe({
  name: 'filterMemoOfDispatch'
})
export class FilterMemoOfDispatchPipe implements PipeTransform {
  transform(
    memoOfDispatchList: MemoOfDispatch[],
    search = '',
    cargoOperation = '',
    customer = ''
  ): MemoOfDispatch[] {

    if (search.trim()) {
      memoOfDispatchList = memoOfDispatchList.filter(memo => {
        return memo.memoOfDispatchId.toString().includes(search.toLowerCase());
      });
    }

    if (cargoOperation) {
      memoOfDispatchList = memoOfDispatchList.filter(memo => {
        return memo.cargoOperation === cargoOperation;
      });
    }

    if (customer) {
      memoOfDispatchList = memoOfDispatchList.filter(memo => {
        return memo.customer.customerName === customer;
      });
    }

    return memoOfDispatchList;
  }
}
