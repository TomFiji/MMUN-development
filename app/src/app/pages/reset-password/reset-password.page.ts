import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { Location } from '@angular/common';

@Component({
  selector: 'hmn-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  form = {
    values: {
      emailToken: '',
      password: '',
      confirmPassword: '',
    },
    touched: {
      emailToken: false,
      password: false,
      confirmPassword: false,
    },
    errors: {
      emailToken: '',
      password: '',
      confirmPassword: '',
    },
    isValid: false,
  };
  constructor(private userDaoService: UserDAOService, private router: Router, private location: Location) {
    if (!this.userDaoService.userEmailForPasswordReset) {
      this.router.navigateByUrl('/forgotPassword');
    }
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
          if (this.form.values[field] !== this.form.values.password) {
            this.form.errors[field] = 'errors.field.password.notMatch';
            isValid = false;
          }
        } else if (field === 'password') {
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
  onUpdate() {
    if (this.validateForm()) {
      this.userDaoService.resetUserPassword(
        this.form.values.emailToken,
        this.form.values.password
      );
    }
  }

  onBack(){
    this.location.back();
  }
}
