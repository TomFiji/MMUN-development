import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import en from './dict/en.lang';
import fr from './dict/fr.lang';
import kr from './dict/kr.lang';

@Injectable({
  providedIn: 'root',
})
/**
 * Localization Service.
 * This service will translate the tokens into the language string values
 * provided in lang file
 *
 * Code was copied (modifed) from:
 * https://github.com/cyrus2281/PiggyBank/tree/master/src/app/Core/localization
 * @repository https://github.com/cyrus2281/PiggyBank.git
 * @author cyrus2281
 */
export class LocalizationService {
  private languages: { [lang: string]: { [token: string]: string } } = {};
  private sysLang: string = 'en';

  private readonly LOCAL_STORAGE_LANG = 'lang';
  // Array of all support languages
  readonly AVAILABLE_LANGUAGES = ['en', 'fr', 'kr'];

  constructor() {
    this.sysLang = localStorage.getItem(this.LOCAL_STORAGE_LANG) || 'en';
    // adding supporting languages here
    this.languages['en'] = en;
    this.languages['fr'] = fr;
    this.languages['kr'] = kr;
    // checking all locale tokens are translated base on English
    if (!environment.production) {
      for (let lang = 0; lang < this.AVAILABLE_LANGUAGES.length; lang++) {
        if (this.AVAILABLE_LANGUAGES[lang] === 'en') {
          continue;
        }
        const language = this.languages[this.AVAILABLE_LANGUAGES[lang]];
        const allLocale = Object.keys(language);
        const missing = [];
        const same = [];
        Object.keys(this.languages['en']).forEach((locale) => {
          if (allLocale.includes(locale)) {
            if (language[locale] === this.languages['en'][locale]) {
              same.push(locale);
            }
          } else {
            missing.push(locale);
          }
        });
        if (same.length > 0) {
          console.warn('Localization: Same as English for',this.AVAILABLE_LANGUAGES[lang], same)
        }
        if (missing.length > 0) {
          console.warn('Localization: Missing translation for ',this.AVAILABLE_LANGUAGES[lang], missing)
        }
      }
    }
  }

  /**
   * translate a lang token into lang text
   * @param token lang token
   * @param args an array of key-values to replace dynamic values
   * @returns translation, or token if translation not found
   */
  public translate(token: string, ...args: { key: string; value: string }[]) {
    if (this.languages[this.sysLang][token]) {
      if (args?.length > 0) {
        let translation = this.languages[this.sysLang][token];
        args.forEach((arg) => {
          translation = translation
            .split('{{' + arg.key + '}}')
            .join(arg.value);
        });
        return translation;
      }
      return this.languages[this.sysLang][token];
    }
    return token;
  }

  /**
   * Changes the system language
   * @param lang incoming language
   * @returns true on success, false if language was not found
   */
  setLanguage(lang: string) {
    if (this.AVAILABLE_LANGUAGES.includes(lang)) {
      localStorage.setItem(this.LOCAL_STORAGE_LANG, lang);
      this.sysLang = lang;
      location.reload();
      return true;
    }
    return false;
  }

  /**
   * @returns current system language
   */
  getLanguage(): string {
    return this.sysLang;
  }
}
