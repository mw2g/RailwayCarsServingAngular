import {Pipe, PipeTransform} from '@angular/core';
import {BaseRate} from '../../../shared/interfaces';

@Pipe({
    name: 'filterBaseRate'
})
export class FilterBaseRatePipe implements PipeTransform {
    transform(baseRateList: BaseRate[], wagonGroup = ''): BaseRate[] {

        if (wagonGroup) {
            baseRateList = baseRateList.filter(rate => {
                return rate.wagonGroup.groupName === wagonGroup;
            });
        }

        return baseRateList;
    }
}
