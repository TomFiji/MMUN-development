import { Component } from '@angular/core';
import { UserDAOService } from 'src/app/services/user-dao.service';

@Component({
  selector: 'hmn-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  form = {
    values: {
      email: '',
      password: '',
    },
    touched: {
      email: false,
      password: false,
    },
    errors: {
      email: '',
      password: '',
    },
    isValid: false,
  };

  constructor(private userDaoService: UserDAOService) {}

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

  onSubmit() {
    if (this.validateForm()) {
      this.userDaoService.login(
        this.form.values.email,
        this.form.values.password
      );
    }
  }
}
