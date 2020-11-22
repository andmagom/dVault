import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { NetworksService } from 'src/app/services/networks/networks.service';
import { TranslateServiceLocal } from 'src/app/services/translate/translate.service';
import { FormNetworkComponent } from '../form-network/form-network.component';

@Component({
  selector: 'app-networks',
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.css'],
  providers: [TranslateServiceLocal, NetworksService, MessagesService]
})
export class NetworksComponent implements OnInit {

  loading = false;

  constructor(
    private translateService: TranslateServiceLocal,
    public dialog: MatDialog,
    private networksService: NetworksService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void { }

  openDialog(create): void {
    if(create) {
      // bloquear campos input
      this.loading = true;
      this.networksService.create().subscribe(res => {
        this.loading = false;
        this.open({ mode: 'create', url: res.hostname, identity: res.identity });
      }, error => {
        this.loading = false;
        this.messagesService.showErrorNotification('messages.network.error-create', true);
        console.log(error);
      });
    } else {
      this.open({ mode: 'connect'});
    }
    
  }

  open(data) {
    const dialogRef = this.dialog.open(FormNetworkComponent, {
      width: '500px',
      disableClose: true,
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closed: ', result)
    });
  }

}
