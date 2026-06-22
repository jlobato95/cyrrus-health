import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { NgOptimizedImage } from '@angular/common';
import { VaccineService, Campaign, Child } from '../../services/vaccine.service';
import { AlertService } from '../../services/alert.service';

interface EligibilityAlert {
  id: string;
  childId: string;
  childName: string;
  childAge: string;
  avatar: string;
  message: string;
}

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.page.html',
  styleUrls: ['./campaigns.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, RouterLink, NgOptimizedImage],
})
export class CampaignsPage {
  private readonly vaccineService = inject(VaccineService);
  private readonly alertService = inject(AlertService);

  // Campanhas vindas do Service
  public readonly campaigns = this.vaccineService.campaigns;

  // Computado: Filtra a campanha em destaque (gripe)
  public readonly featuredCampaign = computed<Campaign | null>(() => {
    return this.campaigns().find((c) => c.id === 'campanha-gripe') ?? null;
  });

  // Computado: Alertas de elegibilidade dinâmica das crianças cadastradas
  public readonly eligibilityAlerts = computed<EligibilityAlert[]>(() => {
    const kids = this.vaccineService.children();
    const alerts: EligibilityAlert[] = [];

    kids.forEach((kid) => {
      // Regras de elegibilidade simuladas com base na idade cadastrada
      const ageLower = kid.age.toLowerCase();
      
      // Se tiver meses (ex: "8 meses", "14 meses") ou anos
      const isInfant = ageLower.includes('meses') || ageLower.includes('mês');
      const monthsMatch = ageLower.match(/(\d+)\s*meses/i);
      const months = monthsMatch ? parseInt(monthsMatch[1], 10) : 12;

      // 1. Elegibilidade para Influenza (Gripe): todas acima de 6 meses
      if (isInfant && months >= 6) {
        alerts.push({
          id: `${kid.id}-gripe`,
          childId: kid.id,
          childName: kid.name,
          childAge: kid.age,
          avatar: kid.avatarUrl,
          message: `Elegível para a dose anual da <strong>Influenza</strong>. A campanha de vacinação contra a gripe está ativa.`,
        });
      }

      // 2. Elegibilidade para Pólio: crianças entre 1 e 5 anos (12 a 60 meses)
      const isEligibleForPolio = (isInfant && months >= 12) || ageLower.includes('ano');
      if (isEligibleForPolio && !ageLower.includes('6') && !ageLower.includes('7')) {
        alerts.push({
          id: `${kid.id}-polio`,
          childId: kid.id,
          childName: kid.name,
          childAge: kid.age,
          avatar: kid.avatarUrl,
          message: `Elegível para a dose de reforço da <strong>Pólio</strong> na próxima campanha do Dia Nacional (24/Out).`,
        });
      }
    });

    return alerts;
  });

  // Seleciona a criança no service para abrir a timeline correta
  public selectChild(id: string): void {
    this.vaccineService.selectChild(id);
  }

  // Simula busca por clínicas próximas
  public findClinics(): void {
    this.alertService.showInfo(
      'Buscar Clínicas',
      'Buscando as clínicas de saúde e postos de vacinação mais próximos da sua localização...'
    );
  }
}
