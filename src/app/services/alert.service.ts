import { Injectable, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  // Mostra um alerta com botão de OK
  public async showInfo(header: string, message: string, buttonText = 'OK'): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: buttonText,
          role: 'confirm',
          handler: () => true
        }
      ],
      cssClass: 'cyrrus-alert'
    });

    await alert.present();
  }

  // Mostra um alerta de confirmação (Sim/Não)
  public async showConfirm(
    header: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
  ): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          handler: () => {
            if (onCancel) onCancel();
          }
        },
        {
          text: confirmText,
          role: 'confirm',
          handler: () => {
            onConfirm();
          }
        }
      ],
      cssClass: 'cyrrus-alert'
    });

    await alert.present();
  }

  // Mostra um toast rápido na parte inferior da tela
  public async showToast(message: string, color: 'success' | 'warning' | 'danger' | 'primary' | 'medium' = 'success', duration = 3000): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration,
      position: 'bottom',
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ],
      cssClass: 'cyrrus-toast'
    });

    await toast.present();
  }
}

