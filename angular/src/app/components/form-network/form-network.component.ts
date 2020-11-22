import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { NetworksService } from 'src/app/services/networks/networks.service';
import { TranslateServiceLocal } from 'src/app/services/translate/translate.service';

@Component({
  selector: 'app-form-network',
  templateUrl: './form-network.component.html',
  styleUrls: ['./form-network.component.css'],
  providers: [TranslateServiceLocal, NetworksService, MessagesService]
})
export class FormNetworkComponent implements OnInit {

  networkForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private translateServiceLocal: TranslateServiceLocal,
    public dialogRef: MatDialogRef<FormNetworkComponent>,
    private networksService: NetworksService,
    private messagesService: MessagesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  close(): void {
    this.dialogRef.close();
  }

  goToLogin() {
    close();
    this.translateServiceLocal.changeRedirect('/login');
  }

  ngOnInit(): void {
    this.networkForm = this.formBuilder.group({
      hostname: [this.data && this.data.url ? this.data.url : '', [Validators.required, Validators.minLength(6)]],
      identity: [this.data && this.data.identity ? this.data.identity : '', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.networkForm.controls; }

  onSubmit() {
    if (this.networkForm.invalid) {
      return;
    }
    if(this.data.mode === 'connect') {
      this.loading = true;
      this.networksService.connect(this.networkForm.value).subscribe(res => {
        this.loading = false;
        this.close();
        this.translateServiceLocal.changeRedirect('/login');
        this.messagesService.showSuccessNotification('messages.network.connected');
        // this.dialogRef.close(res);
      }, error => {
        this.loading = false;
        this.messagesService.showErrorNotification('messages.network.error', true);
        console.log(error);
      });
    }
  }

}
