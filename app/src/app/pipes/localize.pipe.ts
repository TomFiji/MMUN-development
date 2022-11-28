import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from '../localization/localization.service';

@Pipe({
  name: 'localize'
})
/**
 * Localization Pipe.
 * This pip will translate the tokens into the language string values
 * provided in lang file
 *
 * Code was copied from:
 * https://github.com/cyrus2281/PiggyBank/tree/master/src/app/Core/localization
 * @repository https://github.com/cyrus2281/PiggyBank.git
 * @author cyrus2281
 */
export class LocalizePipe implements PipeTransform {

  constructor(private localizationService: LocalizationService){}

  transform(value: string, ...args: {key: string; value: string;}[]): string {
    return this.localizationService.translate(value, ...args);
  }
}
