import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  static readonly thousand = 1000;
  static readonly million = 1000000;
  static readonly billion = 1000000000;

  transform(number: number): string {
    let formattedNumber = ''
    if (number > NumberFormatPipe.billion) {
      formattedNumber = (number / NumberFormatPipe.billion).toFixed(2) + "B";
    } else if (number > NumberFormatPipe.million) {
      formattedNumber = (number / NumberFormatPipe.million).toFixed(2) + "M";
    } else if (number > NumberFormatPipe.thousand) {
      formattedNumber = (number / NumberFormatPipe.thousand).toFixed(2) + "K";
    } else{
      formattedNumber = number.toString();
    }
    return formattedNumber
  }

}
