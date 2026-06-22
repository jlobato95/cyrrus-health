import { Injectable, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  /**
   * Exibe um modal de alerta informativo padrão.
   * @param header Título do alerta.
   * @param message Mensagem de texto a ser exibida.
   * @param buttonText Texto do botão de fechamento.
   */
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

  /**
   * Exibe um modal de confirmação com ação de Confirmar e Cancelar.
   * @param header Título do alerta.
   * @param message Mensagem de texto a ser exibida.
   * @param onConfirm Callback executado ao confirmar.
   * @param onCancel Callback executado ao cancelar.
   * @param confirmText Texto do botão de confirmação.
   * @param cancelText Texto do botão de cancelamento.
   */
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

  /**
   * Exibe uma notificação do tipo Toast (alerta rápido no rodapé).
   * @param message Mensagem a ser exibida no Toast.
   * @param color Cor do Toast mapeada para as variáveis do Ionic ('success' | 'warning' | 'danger' | 'primary' | 'medium').
   * @param duration Duração em milissegundos.
   */
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
