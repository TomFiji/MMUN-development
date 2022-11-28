import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserDAOService } from 'src/app/services/user-dao.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'hmn-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnDestroy {
  private subscriptions = new SubSink();
  email!: string;

  form = {
    values: {
      emailToken: '',
    },
    touched: {
      emailToken: false,
    },
    errors: {
      emailToken: '',
    },
    isValid: false,
  };

  constructor(public userDaoService: UserDAOService, private router: Router) {
    if (!this.userDaoService.isPending) {
      if (!this.userDaoService.userEmailForUpdateEmail) {
        this.router.navigateByUrl('/updateEmail');
        return;
      }
      this.email = this.userDaoService.userEmailForUpdateEmail;
    } else {
      this.subscriptions.add(
        this.userDaoService.getUser().subscribe((userData) => {
          this.email = userData.email;
        })
      );
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
      }
    });
    this.form.isValid = isValid;
    return isValid;
  }

  onResend() {
    this.userDaoService.resendEmailConfirmToken();
  }

  onLogout() {
    this.userDaoService.logout();
  }

  onConfirm() {
    if (this.validateForm()) {
      this.userDaoService.confirmEmailUpdate(this.form.values.emailToken);
      this.form.values.emailToken = '';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
