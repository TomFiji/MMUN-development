import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hmn-infinite-list',
  templateUrl: './infinite-list.component.html',
  styleUrls: ['./infinite-list.component.scss'],
})
export class InfiniteListComponent<T> {
  @Input() name: T;
  @Input() threshold: string = '100px';
  @Output() loadData = new EventEmitter<{ event: any; name: T }>();

  constructor() {
    setTimeout(() => {
      const div =
        document.querySelectorAll(
          'hmn-infinite-list > div > ion-content'
        ) || [];
      div.forEach((el) => {
        const element = el.shadowRoot?.querySelector('main');
        if (element) {
          element.style.marginRight = '-19px';
        }
      });
    }, 10);
  }
}
