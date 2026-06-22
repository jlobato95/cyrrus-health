import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NgOptimizedImage } from '@angular/common';
import { VaccineService } from './services/vaccine.service';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage],
})
export class AppComponent {
  private readonly vaccineService = inject(VaccineService);
  private readonly alertService = inject(AlertService);

  // Signals do Service
  public readonly children = this.vaccineService.children;
  public readonly activeChild = this.vaccineService.activeChild;

  // Controle de Dropdown local
  public readonly isDropdownOpen = signal<boolean>(false);

  public toggleDropdown(): void {
    this.isDropdownOpen.update((prev) => !prev);
  }

  public selectChild(id: string): void {
    this.vaccineService.selectChild(id);
    this.isDropdownOpen.set(false);
  }

  public showNotifications(): void {
    this.alertService.showToast('Nenhuma notificação nova no momento.', 'medium');
  }

  public showSettings(): void {
    this.alertService.showInfo('Configurações', 'Configurações do perfil e da família.');
  }

  public logout(): void {
    this.alertService.showConfirm(
      'Sair do Portal',
      'Deseja realmente sair da sua conta Cyrrus Health?',
      () => {
        this.alertService.showToast('Sessão encerrada.', 'primary');
      }
    );
  }
}
