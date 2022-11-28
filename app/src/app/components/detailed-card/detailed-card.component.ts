import { Component, Input, OnInit } from '@angular/core';

export interface DetailedCardDetail {
  label: string;
  value: string;
}

export interface DetailedCardOption {
  label?: string;
  icon?: string;
  action: (id: string) => void;
}

export interface DetailedCardModel {
  title: string;
  id: string;
  href: string;
  imgUrl?: string;
  details: DetailedCardDetail[];
  options: DetailedCardOption[];
}

@Component({
  selector: 'hmn-detailed-card',
  templateUrl: './detailed-card.component.html',
  styleUrls: ['./detailed-card.component.scss'],
})
export class DetailedCardComponent implements OnInit {
  @Input() title: string;
  @Input() id: string;
  @Input() href: string;
  @Input() imgUrl?: string;
  @Input() details: DetailedCardDetail[];
  @Input() options: DetailedCardOption[];

  constructor() {}

  ngOnInit() {}
}
