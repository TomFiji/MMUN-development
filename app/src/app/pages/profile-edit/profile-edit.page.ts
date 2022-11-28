import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AuthorType } from 'src/app/enums/author-type';
import { UserModel } from 'src/app/interfaces/user.model';
import { LocalizationService } from 'src/app/localization/localization.service';
import {
  ToastDuration,
  ToastService,
  ToastStyle,
} from 'src/app/services/toast.service';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { SubSink } from 'subsink';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hmn-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnDestroy {
  loadedGroups = [];
  lastSearchedQuery: string = '';
  form = {
    touched: {
      group: false,
      phoneNumber: false,
      country: false,
      zipCode: false,
    },
    errors: {
      group: '',
      phoneNumber: '',
      country: '',
      zipCode: '',
    },
    isValid: false,
  };

  userData: UserModel;
  private subscriptions = new SubSink();

  constructor(
    private localizationService: LocalizationService,
    private userDAOService: UserDAOService,
    private toastService: ToastService,
    private location: Location,
  ) {
    this.subscriptions.add(
      this.userDAOService.getUser().subscribe((userData) => {
        this.userData = userData;
      })
    );
  }

  onBack() {
    this.location.back();
  }

  validateForm() {
    let isValid = true;
    const fields = Object.keys(this.form.touched);
    fields.forEach((field) => {
      this.form.errors[field] = '';
      if (
        String(this.userData[field]).length <= 0 ||
        String(this.userData[field]).trim().length <= 0
      ) {
        this.form.errors[field] = 'errors.field.required';
        isValid = false;
      } else {
        if (field === 'phoneNumber') {
          if (
            !/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
              this.userData[field]
            )
          ) {
            const numberLocale =
              this.localizationService.translate('core.number');
            this.form.errors[field] = this.localizationService.translate(
              'errors.field.invalid',
              { key: 'name', value: numberLocale }
            );
            isValid = false;
          }
        } else if (field === 'group') {
          if (
            this.userData.authorType === AuthorType.STUDENT &&
            !this.loadedGroups.includes(this.userData.group.toLowerCase().trim())
          ) {
            this.form.errors[field] = this.localizationService.translate(
              'errors.field.invalid.group'
            );
            isValid = false;
          }
        }
      }
    });

    this.form.isValid = isValid;
    return isValid;
  }

  searchGroups() {
    if (
      this.userData.group.length > 2 &&
      this.lastSearchedQuery !== this.userData.group
    ) {
      this.lastSearchedQuery = this.userData.group;
      this.userDAOService
        .searchGroups(this.userData.group)
        .subscribe((groups) => {
          this.loadedGroups = groups.map((group) => group.name);
        });
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      this.userDAOService.updateUserProfile(this.userData);
    } else {
      Object.keys(this.form.touched).forEach(
        (key) => (this.form.touched[key] = true)
      );
      this.toastService.showToast({
        message: 'errors.field.fixIt',
        style: ToastStyle.ERROR,
        duration: ToastDuration.MEDIUM,
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
