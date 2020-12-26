import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/login/login.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { TranslateServiceLocal } from 'src/app/services/translate/translate.service';
import { FormSecretComponent } from '../form-secret/form-secret.component';

@Component({
  selector: 'app-secrets',
  templateUrl: './secrets.component.html',
  styleUrls: ['./secrets.component.css'],
  providers: [SocketService, TranslateServiceLocal, LoginService]
})
export class SecretsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'web', 'user', 'passwd', 'meta', 'date'];
  dataSource: MatTableDataSource<any>;
  buttonDisabled = true;
  loading = true;
  userInSession = false;

  secrets = [];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private socketService: SocketService, private dialog: MatDialog, private loginService: LoginService) {
    this.dataSource = new MatTableDataSource(this.secrets);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.checkUserInSession();
  }

  checkUserInSession() {
    const dataUser = this.loginService.currentUserValue;
    const dataUserRegister = this.loginService.getLocalStorage('user_dvault_register');
    console.log(dataUserRegister);
    if (dataUser) {
      this.userInSession = true;
    }
    if(!dataUserRegister) {
      this.socketEvents();
    } else {
      this.loading = false;
      this.buttonDisabled = false;
      localStorage.removeItem('user_dvault_register');
    }
  }

  socketEvents() {
    console.log('iniciar Socket');
    this.socketService.connect();
    this.socketService.subscribeSecretFound().subscribe(secret => {
      this.secretFound(secret);
    });
    this.socketService.subscribeSecretEnd().subscribe(data => {
      this.endSecrets(data);
    });
    this.socketService.subscribeDisconnect().subscribe(() => {
      this.disconnected();
    });
  }

  secretFound(secret) {
    console.log('Print', secret);
    this.secrets.push(secret);
    this.dataSource = new MatTableDataSource(this.secrets);
  }

  endSecrets(data) {
    console.log('End', data);
    this.loginService.setLocalStorage('last_secret_dvault', data)
    this.buttonDisabled = false;
    this.loading = false;
  }

  disconnected() {
    console.log('Disconnected!');
  }

  openModal() {
    const dialogRef = this.dialog.open(FormSecretComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed: ', result)
      if (result) {
        const secret = result.content;
        secret['id'] = result.id;
        this.secretFound(secret);
      }
    });
  }

  copyPassword(val){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
