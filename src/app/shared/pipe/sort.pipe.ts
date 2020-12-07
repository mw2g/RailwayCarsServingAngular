import {Pipe, PipeTransform} from '@angular/core';
import {DeliveryOfWagon} from '../../shared/interfaces';

@Pipe({
    name: 'sort'
})
export class SortPipe implements PipeTransform {
    transform(
        deliveries: DeliveryOfWagon[],
        search = '',
        cargoOperation = '',
        customer = '',
        loadUnloadWork = ''
    ): DeliveryOfWagon[] {
        if (search.trim()) {
            deliveries = deliveries.filter(delivery => {
                return delivery.wagon ? delivery.wagon.toLowerCase().includes(search.toLowerCase()) : false;
            });
        }

        if (cargoOperation) {
            deliveries = deliveries.filter(delivery => {
                return delivery.cargoOperation === cargoOperation;
            });
        }

        if (customer) {
            deliveries = deliveries.filter(delivery => {
                return delivery.customer === customer;
            });
        }

        if (loadUnloadWork) {
            deliveries = deliveries.filter(delivery => {
                return delivery.loadUnloadWork === (loadUnloadWork === 'yes' ? true : false);
            });
        }

        return deliveries;
    }
}
