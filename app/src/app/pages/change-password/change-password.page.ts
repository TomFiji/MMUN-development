import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDAOService } from 'src/app/services/user-dao.service';

@Component({
  selector: 'hmn-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  form = {
    values: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    touched: {
      password: false,
      newPassword: false,
      confirmPassword: false,
    },
    errors: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    isValid: false,
  };

  constructor(private userDaoService: UserDAOService, private location: Location) {}

  onBack() {
    this.location.back();
  }

  validateForm() {
    let isValid = true;
    const fields = Object.keys(this.form.values);
    fields.forEach((field) => {
      this.form.errors[field] = '';
      if (String(this.form.values[field]).trim().length <= 0) {
        this.form.errors[field] = 'errors.field.required';
        isValid = false;
      } else {
        if (field === 'confirmPassword') {
          if (this.form.values[field] !== this.form.values.newPassword) {
            this.form.errors[field] = 'errors.field.password.notMatch';
            isValid = false;
          }
        } else if (field === 'newPassword') {
          if (
            !/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(
              this.form.values[field]
            )
          ) {
            this.form.errors[field] = 'errors.field.password.week';
            isValid = false;
          }
        }
      }
    });
    this.form.isValid = isValid;
    return isValid;
  }
  onChange() {
    if (this.validateForm()) {
      this.userDaoService.changeUserPassword(
        this.form.values.password,
        this.form.values.newPassword
      );
    }
  }
}
