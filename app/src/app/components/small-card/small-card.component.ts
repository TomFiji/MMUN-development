import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hmn-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss'],
})
export class SmallCardComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() imageUrl: string;
  @Input() href: string;
  @Input() editable: boolean = false;
  @Output() onEdit = new EventEmitter()
  @Output() onDelete = new EventEmitter()

   onEditClick(e:Event) {
    e.preventDefault()
    e.stopPropagation()
    this.onEdit.emit()
   }

   onDeleteClick(e:Event) {
    e.preventDefault()
    e.stopPropagation()
    this.onDelete.emit()
   }
}
