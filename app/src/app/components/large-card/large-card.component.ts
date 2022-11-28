import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';

@Component({
  selector: 'hmn-large-card',
  templateUrl: './large-card.component.html',
  styleUrls: ['./large-card.component.scss'],
})
export class LargeCardComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() href: string;
  @Input() votes?: number;
  @Input() shareable: boolean;
  @Input() editable: boolean = false;
  @Output() onEdit = new EventEmitter()
  @Output() onDelete = new EventEmitter()
  /**shareableStatus is used for setting the classes for the share button in html*/
  shareableStatus= false;

  constructor() { }

  ngOnInit() {}

  onShare(e: Event) {
    e.preventDefault()
    console.log('Sharing: ', this.href);
  }
}
