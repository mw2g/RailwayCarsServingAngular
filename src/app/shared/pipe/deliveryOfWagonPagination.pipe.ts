import {Pipe, PipeTransform} from '@angular/core';
import {DeliveryOfWagon, MemoOfDelivery} from '../../shared/interfaces';

@Pipe({
  name: 'deliveryOfWagonPagination'
})
export class DeliveryOfWagonPaginationPipe implements PipeTransform {

  transform(deliveryOfWagons: DeliveryOfWagon[], page: number, rowsOnPage: number): DeliveryOfWagon[] {
    const pageDeliveries: DeliveryOfWagon[] = [];
    for (let i = rowsOnPage * page; i < (rowsOnPage + (rowsOnPage * page)) && i < deliveryOfWagons.length; i++) {
      pageDeliveries.push(deliveryOfWagons[i]);
    }
    return pageDeliveries;
  }
}
