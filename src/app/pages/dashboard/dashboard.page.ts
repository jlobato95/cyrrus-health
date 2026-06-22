import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { NgOptimizedImage } from '@angular/common';
import { VaccineService, Child, Vaccine } from '../../services/vaccine.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, RouterLink, NgOptimizedImage],
})
export class DashboardPage {
  private readonly vaccineService = inject(VaccineService);
  private readonly alertService = inject(AlertService);

  // Signals do Service
  public readonly activeChild = this.vaccineService.activeChild;
  public readonly metrics = this.vaccineService.activeChildMetrics;

  // Computado para a vacina em destaque (1ª Atrasada ou, se não houver, 1ª Pendente)
  public readonly spotlightVaccine = computed<Vaccine | null>(() => {
    const vaccines = this.vaccineService.activeChildVaccines();
    
    // Procura primeira atrasada
    const alertVaccine = vaccines.find((v) => v.status === 'alert');
    if (alertVaccine) {
      return alertVaccine;
    }

    // Se não houver atrasada, procura primeira pendente
    const pendingVaccine = vaccines.find((v) => v.status === 'pending');
    if (pendingVaccine) {
      return pendingVaccine;
    }

    return null;
  });

  // Computado para atividade recente (pega as 3 primeiras vacinas)
  public readonly recentActivity = computed<Vaccine[]>(() => {
    const vaccines = this.vaccineService.activeChildVaccines();
    // Retorna no máximo 3 vacinas ordenadas (ex: as aplicadas primeiro)
    const applied = vaccines.filter((v) => v.status === 'applied');
    const alerts = vaccines.filter((v) => v.status === 'alert');
    const pendings = vaccines.filter((v) => v.status === 'pending');

    return [...alerts, ...pendings, ...applied].slice(0, 3);
  });

  // Aplica a vacina
  public applyVaccine(id: string): void {
    this.vaccineService.markAsApplied(id);
    this.alertService.showToast('Vacina registrada como aplicada com sucesso!', 'success');
  }
}
