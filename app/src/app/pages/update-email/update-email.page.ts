import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { UserDAOService } from 'src/app/services/user-dao.service';

@Component({
  selector: 'hmn-update-email',
  templateUrl: './update-email.page.html',
  styleUrls: ['./update-email.page.scss'],
})
export class UpdateEmailPage {
  form = {
    values: {
      newEmail: '',
    },
    touched: {
      newEmail: false,
    },
    errors: {
      newEmail: '',
    },
    isValid: false,
  };
  constructor(private userDaoService: UserDAOService, private location: Location) {}

  validateForm() {
    let isValid = true;
    this.form.errors.newEmail = '';
    if (String(this.form.values.newEmail).trim().length <= 0) {
      this.form.errors.newEmail = 'errors.field.required';
      isValid = false;
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(
        this.form.values.newEmail
      )
    ) {
      this.form.errors.newEmail = 'errors.field.invalid.email';
      isValid = false;
    }
    this.form.isValid = isValid;
    return isValid;
  }

  onBack() {
    this.location.back();
  }

  onUpdate() {
    if (this.validateForm()) {
      this.userDaoService.requestEmailUpdate(this.form.values.newEmail);
    }
  }
}
