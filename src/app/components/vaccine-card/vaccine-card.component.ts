import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { Vaccine } from '../../services/vaccine.service';

@Component({
  selector: 'app-vaccine-card',
  templateUrl: './vaccine-card.component.html',
  styleUrls: ['./vaccine-card.component.scss'],
  standalone: true,
  imports: [IonButton],
})
export class VaccineCardComponent {
  @Input({ required: true }) public vaccine!: Vaccine;
  @Output() public readonly applied = new EventEmitter<string>();

  public onApplyClick(): void {
    this.applied.emit(this.vaccine.id);
  }
}
