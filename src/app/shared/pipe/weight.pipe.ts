import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'weight'
})
export class WeightPipe implements PipeTransform {
  transform(value: number, args?: any): string {
    let stringValue: string = value.toString();
    if (stringValue.length > 3) {
      stringValue = stringValue.substr(0, 3);
    }
    return stringValue;
  }
}
