import {Pipe, PipeTransform} from '@angular/core';
import {CargoType} from '../../../shared/interfaces';

@Pipe({
    name: 'searchCargoType'
})
export class SearchCargoTypePipe implements PipeTransform {
    transform(cargoTypes: CargoType[], search = ''): CargoType[] {
        if (!search.trim()) {
            return cargoTypes;
        }

        return cargoTypes.filter(type => {
            return type.typeName.toLowerCase().includes(search.toLowerCase());
        });
    }
}
