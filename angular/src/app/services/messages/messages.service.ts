import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateServiceLocal } from '../translate/translate.service'

declare const alertify: any;

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private router: Router, private translateService: TranslateServiceLocal) { }

  showSuccessAlert(pathMessage, icon, route, header = '¡Éxito!') {// check_circle, window.location.reload();
    const message = this.translateService.getTxtTranslated(pathMessage);
    let callback = () => { };
    if (route) {
      callback = () => {
        this.translateService.changeRedirect(route);
      };
    }
    alertify.alert(
      `<i class="material-icons icon-success">${icon}</i><br>
      <center><p class="texto-exito">${message}</p></center>`, callback).set({
        label: 'Ok',
        'closable': false
      }).setHeader(header);
  }

  showErrorAlert(pathMessage) {
    const message = this.translateService.getTxtTranslated(pathMessage);
    alertify.alert('<div style="text-align: center;"><h1>Oops...</h1></div>' +
      '<center><p class="texto-gray">' + message + '</p></center>',
      () => { }).set({
        label: 'Ok',
        'closable': false
      }).setHeader('¡Error!');
  }

  showErrorNotification(message, path = false) {
    if (path) {
      const message_translated = this.translateService.getTxtTranslated(message);
      alertify.error(message_translated);
    } else {
      alertify.error(message);
    }
  }

  showSuccessNotification(pathMessage) {
    const message = this.translateService.getTxtTranslated(pathMessage);
    alertify.success(message);
  }

}
