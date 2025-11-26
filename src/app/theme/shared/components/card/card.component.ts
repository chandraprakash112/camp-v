import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  // public props
  @Input() cardTitle: string;
  @Input() customHeader: boolean;
  @Input() modalId: string;
  @Output() callbackFun = new EventEmitter<any>();
}
