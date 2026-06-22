import { Component, inject, computed } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { VaccineService, Child, Vaccine } from '../../services/vaccine.service';
import { AlertService } from '../../services/alert.service';
import { VaccineCardComponent } from '../../components/vaccine-card/vaccine-card.component';

interface GroupedMilestone {
  milestone: string;
  status: 'applied' | 'pending' | 'alert';
  icon: string;
  items: Vaccine[];
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, VaccineCardComponent],
})
export class TimelinePage {
  private readonly vaccineService = inject(VaccineService);
  private readonly alertService = inject(AlertService);

  // Criança ativa selecionada
  public readonly activeChild = this.vaccineService.activeChild;

  // Computado: Agrupa as vacinas da criança ativa por milestone de aplicação
  public readonly groupedVaccines = computed<GroupedMilestone[]>(() => {
    const vaccines = this.vaccineService.activeChildVaccines();
    const groups: GroupedMilestone[] = [];
    
    // Lista ordenada de milestones padrão do Calendário Nacional
    const milestonesOrder = ['Ao Nascer', '2 Meses', '4 Meses', '6 Meses', '12 Meses', '15 Meses'];
    
    // Agrupa os milestones na ordem recomendada
    milestonesOrder.forEach((milestone) => {
      const items = vaccines.filter((v) => v.milestone === milestone);
      if (items.length > 0) {
        groups.push(this.createGroup(milestone, items));
      }
    });

    // Adiciona quaisquer outros milestones customizados não contemplados na ordem padrão
    const processedMilestones = new Set(milestonesOrder);
    vaccines.forEach((v) => {
      if (!processedMilestones.has(v.milestone)) {
        const items = vaccines.filter((x) => x.milestone === v.milestone);
        groups.push(this.createGroup(v.milestone, items));
        processedMilestones.add(v.milestone);
      }
    });

    return groups;
  });

  // Cria um objeto de Milestone agrupado determinando o status consolidado do grupo
  private createGroup(milestone: string, items: Vaccine[]): GroupedMilestone {
    let status: 'applied' | 'pending' | 'alert' = 'applied';

    if (items.some((v) => v.status === 'alert')) {
      status = 'alert';
    } else if (items.some((v) => v.status === 'pending')) {
      status = 'pending';
    }

    const icon = status === 'applied' ? 'check_circle' : status === 'alert' ? 'warning' : 'schedule';

    return {
      milestone,
      status,
      icon,
      items,
    };
  }

  // Registra a aplicação de uma vacina
  public applyVaccine(id: string): void {
    this.vaccineService.markAsApplied(id);
    this.alertService.showToast('Vacina registrada como aplicada com sucesso!', 'success');
  }

  // Simula o download do PDF
  public downloadPdf(): void {
    this.alertService.showToast(
      `O download da Carteira Digital de Vacinação de ${this.activeChild().name} foi iniciado no formato PDF.`,
      'success'
    );
  }
}
