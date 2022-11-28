import { ToastService } from './../../services/toast.service';
import { UserDAOService } from './../../services/user-dao.service';
import { LocalizationService } from './../../localization/localization.service';
import { AuthorType } from './../../enums/author-type';
import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/interfaces/user.model';
import { ToastStyle, ToastDuration } from 'src/app/services/toast.service';
const emailRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const phoneNumberRegEx = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const passwordRegEx = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;

@Component({
  selector: 'hmn-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  tab = AuthorType.STUDENT;
  authorType = AuthorType;
  loadedGroups = [];
  lastSearchedQuery: string = '';
  form = {
    values: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      country: '',
      zipCode: '',
      birthDate: '',
      group: '',
      password: '',
      confirmPassword: '',
      authorType: AuthorType.STUDENT,
    },
    touched: {
      firstName: false,
      lastName: false,
      email: false,
      phoneNumber: false,
      country: false,
      zipCode: false,
      birthDate: false,
      group: false,
      password: false,
      confirmPassword: false,
    },
    errors: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      country: '',
      zipCode: '',
      birthDate: '',
      group: '',
      password: '',
      confirmPassword: '',
    },
    isValid: false,
  };

  constructor(
    private localizationService: LocalizationService,
    private userDaoService: UserDAOService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  onTabChange(type: AuthorType) {
    this.tab = type;
    this.form.values.authorType = type;
    this.validateForm();
  }

  validateForm() {
    let isValid = true;
    const fields = Object.keys(this.form.values);
    fields.forEach((field) => {
      this.form.errors[field] = '';
      if (String(this.form.values[field]).trim().length <= 0 &&
        !(this.tab === AuthorType.USER || this.tab === AuthorType.ORGANIZATION && field === 'group')){
          this.form.errors[field] = 'errors.field.required';
          isValid = false;
      }else {
        if (field === 'email' && emailRegex.test(this.form.values[field])) {
          this.form.errors[field] = 'errors.field.invalid.email';
          isValid = false;
        } else if (field === 'confirmPassword' && this.form.values[field] !== this.form.values.password) {
          this.form.errors[field] = 'errors.field.password.notMatch';
          isValid = false;
        } else if (field === 'password' && !passwordRegEx.test(this.form.values[field])) {
          this.form.errors[field] = 'errors.field.password.week';
          isValid = false;
        } else if (field === 'phoneNumber' && !phoneNumberRegEx.test(this.form.values[field])) {
            const numberLocale = this.localizationService.translate('core.number');
            this.form.errors[field] = this.localizationService.translate(
              'errors.field.invalid',
              { key: 'name', value: numberLocale }
            );
            isValid = false;
        } else if (field === 'birthDate' && (new Date(this.form.values[field]).getFullYear() >
            new Date().getFullYear() ||
              new Date(this.form.values[field]).getFullYear() < 1900)) {
          const birthLocale = this.localizationService.translate('core.birthDate');
          this.form.errors[field] = this.localizationService.translate(
            'errors.field.invalid',
            { key: 'name', value: birthLocale }
          );
          isValid = false;
        } else if (field === 'group' && this.tab === AuthorType.STUDENT &&
            !this.loadedGroups.includes(this.form.values[field].toLowerCase().trim())) {
          this.form.errors[field] = this.localizationService.translate(
            'errors.field.invalid.group'
          );
          isValid = false;
        }else if (field === 'group' && this.tab === AuthorType.TEACHER &&
            this.loadedGroups.includes(this.form.values[field].toLowerCase().trim())) {
          this.form.errors[field] = this.localizationService.translate(
            'errors.field.invalid.group'
          );
          isValid = false;
        }
      }
    });
    this.form.isValid = isValid;
    return isValid;
  }

  searchGroups() {
    if (
      this.form.values.group.length > 2 &&
      this.lastSearchedQuery !== this.form.values.group
    ) {
      this.lastSearchedQuery = this.form.values.group;
      this.userDaoService
        .searchGroups(this.form.values.group)
        .subscribe((groups) => {
          this.loadedGroups = groups.map((group) => group.name);
        });
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      this.userDaoService.createAccount({
        ...this.form.values,
        birthDate: new Date(this.form.values.birthDate),
      });
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
}
