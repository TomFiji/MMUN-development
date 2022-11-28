import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hmn-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {
wrongPage = 'assets/img/404.png';
  constructor() { }

  ngOnInit() {
  }

}
