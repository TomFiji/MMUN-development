import { LocalizationService } from './../localization/localization.service';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export enum ToastDuration {
  SHORT = 2000,
  MEDIUM = 3000,
  LONG = 4500,
}

export enum ToastPosition {
  BOTTOM = 'bottom',
  TOP = 'top',
  CENTER = 'middle',
}

export enum ToastStyle {
  INFO = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'danger',
}

export interface ToastOptions {
  message: string;
  messageLocaleTokens?: {key: string; value: string;}[];
  header?: string;
  duration?: ToastDuration;
  position?: ToastPosition;
  icon?: string;
  style?: ToastStyle;
  onToastClick?: (e: Event) => void;
  closeButton?: boolean;
  buttons?: {
    text?: string;
    icon?: string;
    role?: 'cancel';
    handler?: () => boolean | void | Promise<boolean | void>;
  }[];
}

@Injectable({
  providedIn: 'root',
})
/**
 * built base on https://ionicframework.com/docs/api/toast
 */
export class ToastService {
  constructor(
    public toastController: ToastController,
    private localizationService: LocalizationService
  ) {}

  /**
   * shows a toast message
   * @param options options to configure the toast message
   * @param options.message the toast message
   * @param options.messageLocaleTokens dynamic tokens for the message and header
   * @param options.header header for the toast
   * @param options.duration duration of the toast
   * @param options.position postilion of the toast
   * @param options.icon icon to be added before the message
   * @param options.style style and theming of the toast
   * @param options.onToastClick on toast click event listener function
   * @param options.closeButton whether to add a close button or not
   * @param options.buttons an array of buttons
   * @returns toast object
   */
  async showToast(options: ToastOptions) {
    const {
      message,
      duration = 1000,
      messageLocaleTokens = [],
      header,
      style,
      onToastClick,
      buttons = [],
      closeButton = true,
      ...others
    } = options;
    // translating language tokens
    const localeMessage = this.localizationService.translate(message, ...messageLocaleTokens);
    let localeHeader = undefined;
    if (header) {
      localeHeader = this.localizationService.translate(header, ...messageLocaleTokens);
    }
    if (closeButton) {
      // adding close button
      buttons.push({
        icon: 'close-circle-outline',
        role: 'cancel',
      });
    }
    const localeButtons = buttons.map(button => {
      if (button.text) {
        button.text = this.localizationService.translate(button.text, ...messageLocaleTokens).toUpperCase();
      }
      return button
    })
    const toast = await this.toastController.create({
      message: localeMessage,
      duration,
      header,
      buttons: localeButtons,
      mode: 'ios',
      color: style,
      ...others,
    });
    if (onToastClick) {
      // adding on click listener
      toast.addEventListener('click', onToastClick);
    }
    toast.present();
    return toast;
  }

  /**
   * hides all visible toast one by one
   */
  async hideAll() {
    const top = await this.toastController.getTop();
    if (top) {
      await top.dismiss();
      this.hideAll();
    }
  }
}
