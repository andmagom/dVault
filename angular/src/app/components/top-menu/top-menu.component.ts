import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login/login.service';
import { TranslateServiceLocal } from 'src/app/services/translate/translate.service';
import { CodeQRComponent } from '../code-qr/code-qr.component';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css'],
  providers: [ LoginService, TranslateServiceLocal]
})
export class TopMenuComponent implements OnInit, OnChanges {

  @Input() userInSession = false;
  inizialization = false;

  constructor(
    private loginService: LoginService,
    private translateService: TranslateServiceLocal,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.inizialization = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.userInSession && !this.inizialization) {
      this.inizialization = true;
    }
  }

  logout() {
    this.userInSession = false;
    this.loginService.logout();
    this.translateService.changeRedirect('/login');
  }

  downloadQr() {
    const dataQR = {
      dataQR: "https://www.techiediaries.com/"
    }
    this.openModal(dataQR);
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
