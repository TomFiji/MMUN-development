import { Component } from '@angular/core';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { Location } from '@angular/common';

@Component({
  selector: 'hmn-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  form = {
    values: {
      email: '',
    },
    touched: {
      email: false
    },
    errors: {
      email: ''
    },
    isValid: false,
  };

  constructor(private userDaoService: UserDAOService, private location: Location) {}

  validateForm() {
    let isValid = true;
    const fields = Object.keys(this.form.values);
    fields.forEach((field) => {
      this.form.errors[field] = '';
      if (String(this.form.values[field]).trim().length <= 0) {
        this.form.errors[field] = 'errors.field.required';
        isValid = false;
      } else {
        if (field === 'email') {
          if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(
              this.form.values[field]
            )
          ) {
            this.form.errors[field] = 'errors.field.invalid.email';
            isValid = false;
          }
        }
      }
    });
    this.form.isValid = isValid;
    return isValid;
  }

  onRequest() {
    if(this.validateForm()){
      this.userDaoService.requestPasswordForget(this.form.values.email);
    }
  }

  onBack() {
    this.location.back();
  }
}
