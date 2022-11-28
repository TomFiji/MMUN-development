import { Component, Input, OnInit } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'hmn-empty-list',
  templateUrl: './empty-list.component.html',
  styleUrls: ['./empty-list.component.scss'],
})
export class EmptyListComponent implements OnInit {

  emptyListImg = 'assets/img/empty-list.svg';
  @Input() label: string;
  @Input() actionLabel?: string;
  @Input() actionLink?: string;

  constructor() { }

  ngOnInit() {}

}
