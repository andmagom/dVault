import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login/login.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { SecretService } from 'src/app/services/secret/secret.service';
import { TranslateServiceLocal } from 'src/app/services/translate/translate.service';

@Component({
  selector: 'app-form-secret',
  templateUrl: './form-secret.component.html',
  styleUrls: ['./form-secret.component.css'],
  providers: [TranslateServiceLocal, SecretService, MessagesService, LoginService]
})
export class FormSecretComponent implements OnInit {

  secretForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private secretService: SecretService,
    private loginService: LoginService,
    private messagesService: MessagesService,
    public dialogRef: MatDialogRef<FormSecretComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(res): void {
    this.dialogRef.close(res);
  }

  ngOnInit(): void {
    this.secretForm = this.formBuilder.group({
      web: ['', [Validators.required, Validators.minLength(3)]],
      user: [''],
      passwd: ['', [Validators.required]],
      meta: ['']
    });
  }

  get f() { return this.secretForm.controls; }

  onSubmit() {
    if (this.secretForm.invalid) {
      return;
    }
    let lastIds = this.loginService.getLocalStorage('last_secret_dvault');
    if(typeof lastIds === 'string') {
      lastIds = JSON.parse(lastIds);
    }
    const dataForm = this.secretForm.value
    dataForm['date'] = new Date();
    dataForm['id'] = lastIds.nextId
    const data = {
      "id": lastIds.nextId,
      "lastId": lastIds.lastId,
      "content": dataForm
    }
    console.log(data);
    this.loading = true;
    this.secretService.create(data).subscribe(res => {
      this.loading = false;
      this.loginService.setLocalStorage('last_secret_dvault', res);
      this.messagesService.showSuccessNotification('messages.secret.success-create');
      this.close(data);
    }, e => {
      this.loading = false;
      this.messagesService.showErrorNotification('messages.secret.error-create', true);
      console.error(e);
    })
  }

}
