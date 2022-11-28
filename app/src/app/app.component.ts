import { Component } from '@angular/core';
import { UserDAOService } from './services/user-dao.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public userDaoService: UserDAOService) {}

}
