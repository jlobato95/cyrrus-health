import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Child } from '../../services/vaccine.service';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage],
})
export class ChildCardComponent {
  @Input({ required: true }) public child!: Child;
  @Input() public isActive = false;
  @Output() public readonly selected = new EventEmitter<string>();

  public onCardClick(): void {
    this.selected.emit(this.child.id);
  }
}
