import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { VaccineService, Child } from '../../services/vaccine.service';
import { AlertService } from '../../services/alert.service';
import { ChildCardComponent } from '../../components/child-card/child-card.component';

@Component({
  selector: 'app-family',
  templateUrl: './family.page.html',
  styleUrls: ['./family.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, FormsModule, ChildCardComponent],
})
export class FamilyPage {
  private readonly vaccineService = inject(VaccineService);
  private readonly alertService = inject(AlertService);

  // Signals do Service
  public readonly children = this.vaccineService.children;
  public readonly activeChild = this.vaccineService.activeChild;

  // Signals Locais
  public readonly isAddingChild = signal<boolean>(false);

  // Campos do Formulário
  public newChildName = '';
  public newChildAge = '';

  // Seleciona a criança ativa
  public selectChild(id: string): void {
    this.vaccineService.selectChild(id);
  }

  // Abre modal de cadastro
  public openAddModal(): void {
    this.newChildName = '';
    this.newChildAge = '';
    this.isAddingChild.set(true);
  }

  // Fecha modal de cadastro
  public closeAddModal(): void {
    this.isAddingChild.set(false);
  }

  // Salva nova criança
  public saveChild(): void {
    if (!this.newChildName.trim() || !this.newChildAge.trim()) {
      this.alertService.showToast('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    this.vaccineService.addChild(this.newChildName, this.newChildAge);
    this.alertService.showToast('Perfil de dependente cadastrado com sucesso!', 'success');
    this.closeAddModal();
  }
}
