import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login/login.service';
import { TranslateServiceLocal } from 'src/app/services/translate/translate.service';
import { CodeQRComponent } from '../code-qr/code-qr.component';
import { NetworksService } from 'src/app/services/networks/networks.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css'],
  providers: [ LoginService, TranslateServiceLocal, NetworksService]
})
export class TopMenuComponent implements OnInit, OnChanges {

  @Input() userInSession = false;
  inizialization = false;

  constructor(
    private loginService: LoginService,
    private translateService: TranslateServiceLocal,
    private dialog: MatDialog,
    private networksService: NetworksService
  ) { }

  ngOnInit(): void {
    this.inizialization = true;
    if(this.loginService.currentUserValue) {
      this.userInSession = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.userInSession && !this.inizialization) {
      this.inizialization = true;
    }
  }

  changeRegirect(url){
    this.translateService.changeRedirect(url);
  }

  logout() {
    this.userInSession = false;
    this.loginService.logout();
    this.translateService.changeRedirect('/login');
  }

  downloadQr() {
    this.networksService.create().subscribe(res => {
      const data = {
        hostname: res.hostname,
        identity: res.identity
      }
      const dataQR = {
        dataQR: JSON.stringify(data)
      }
      this.openModal(dataQR);
    });
  }

  openModal(data) {
    const dialogRef = this.dialog.open(CodeQRComponent, {
      width: '500px',
      disableClose: true,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed: ', result);
    });
  }

}
