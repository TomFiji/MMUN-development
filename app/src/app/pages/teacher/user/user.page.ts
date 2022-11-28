import { UserModel } from 'src/app/interfaces/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorType } from 'src/app/enums/author-type';
import { LocalizationService } from 'src/app/localization/localization.service';
import {
  ToastService,
  ToastStyle,
  ToastDuration,
} from 'src/app/services/toast.service';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { Location } from '@angular/common';

@Component({
  selector: 'hmn-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  authorType = AuthorType;

  user!: UserModel;
  loadedGroups = [];
  lastSearchedQuery: string = '';

  form = {
    touched: {
      firstName: false,
      lastName: false,
      email: false,
      phoneNumber: false,
      country: false,
      zipCode: false,
      birthDate: false,
      group: false,
      authorType: false,
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
      authorType: '',
    },
    isValid: false,
  };

  constructor(
    private localizationService: LocalizationService,
    private userDaoService: UserDAOService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params.userId) {
          this.userDaoService.getUserById(params.userId).subscribe((user) => {
            if (user) {
              this.user = user;
            }
          });
        }
      })
    );
  }

  validateForm() {
    let isValid = true;
    const fields = Object.keys(this.form.touched);
    fields.forEach((field) => {
      this.form.errors[field] = '';
      if (this.user.authorType === AuthorType.TEACHER && field === 'group') {
        return;
      }
      if (String(this.user[field]).trim().length <= 0) {
        this.form.errors[field] = 'errors.field.required';
        isValid = false;
      } else {
        if (field === 'email') {
          if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(
              this.user[field]
            )
          ) {
            this.form.errors[field] = 'errors.field.invalid.email';
            isValid = false;
          }
        } else if (field === 'phoneNumber') {
          if (
            !/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
              this.user[field]
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
        } else if (field === 'birthDate') {
          if (
            new Date(this.user[field]).getFullYear() > new Date().getFullYear() ||
            new Date(this.user[field]).getFullYear() < 1900
          ) {
            const birthLocale =
              this.localizationService.translate('core.birthDate');
            this.form.errors[field] = this.localizationService.translate(
              'errors.field.invalid',
              { key: 'name', value: birthLocale }
            );
            isValid = false;
          }
        } else if (field === 'group') {
          if (
            this.user.authorType === AuthorType.STUDENT &&
            !this.loadedGroups.includes(this.user.group.toLowerCase().trim())
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
      this.user.group.length > 2 &&
      this.lastSearchedQuery !== this.user.group
    ) {
      this.lastSearchedQuery = this.user.group;
      this.userDaoService
        .searchGroups(this.user.group)
        .subscribe((groups) => {
          this.loadedGroups = groups.map((group) => group.name);
        });
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      this.userDaoService.updateUserProfile({
        ...this.user,
        birthDate: new Date(this.user.birthDate),
      },
      this.user._id,
      );
      this.location.back();
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
