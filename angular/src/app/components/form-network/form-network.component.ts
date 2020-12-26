import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { NetworksService } from 'src/app/services/networks/networks.service';
import { TranslateServiceLocal } from 'src/app/services/translate/translate.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

declare const ZXing: any;

@Component({
  selector: 'app-form-network',
  templateUrl: './form-network.component.html',
  styleUrls: ['./form-network.component.css'],
  providers: [TranslateServiceLocal, NetworksService, MessagesService]
})
export class FormNetworkComponent implements OnInit {

  networkForm: FormGroup;
  loading = false;
  codeReader = new ZXing.BrowserQRCodeReader()
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  dataQR;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FormNetworkComponent>,
    private networksService: NetworksService,
    private messagesService: MessagesService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(goLogin = null): void {
    this.dialogRef.close(goLogin);
  }

  uploadFile($event) {
    if ($event.target.files.length === 0) {
      return;
    }
    const file = $event.target.files[0];
    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      this.messagesService.showErrorNotification('messages.network.error-qr-file', true);
      return;
    }

    var reader = new FileReader();
    reader.onload = () => {
      var img = new Image(1,1);
      img.src = reader.result + '';
      try {
        this.codeReader.decodeFromImage(img).then((result) => {
          const data = JSON.parse(result);
          this.networkForm.patchValue({
            hostname: data.hostname,
            identity: data.identity
          });
        }).catch((error) => {
          this.messagesService.showErrorNotification('messages.network.error-decode-qr', true);
          console.error('ERROR!', error)
        })
      } catch (error) {
        this.messagesService.showErrorNotification('messages.network.error-decode-qr', true);
        console.error('ERROR!', error);
      }
    }
    reader.readAsDataURL(file);
  }

  ngOnInit(): void {
    this.networkForm = this.formBuilder.group({
      hostname: [this.data && this.data.url ? this.data.url : '', [Validators.required, Validators.minLength(6)]],
      identity: [this.data && this.data.identity ? this.data.identity : '', [Validators.required, Validators.minLength(6)]]
    });
    if(this.data && this.data.identity && this.data.identity) {
      this.dataQR = `{
        "hostname": "${this.data.url}",
        "identity": "${this.data.identity}"
      }`;
    }
  }

  get f() { return this.networkForm.controls; }

  onSubmit() {
    if (this.networkForm.invalid) {
      return;
    }
    if (this.data.mode === 'connect') {
      this.loading = true;
      this.networksService.connect(this.networkForm.value).subscribe(res => {
        this.loading = false;
        this.messagesService.showSuccessNotification('messages.network.connected');
        this.close('goLogin');
      }, error => {
        this.loading = false;
        this.messagesService.showErrorNotification('messages.network.error', true);
        console.log(error);
      });
    }
  }

  downloadQR() {
    var a = document.getElementsByTagName('img');
    for (var i in a) {
      if (a[i].src && a[i].src.substr(0,4) === 'data'){
        var tagA = document.createElement("a");
        tagA.href = a[i].src
        tagA.download = "Dvault_QR.png";
        tagA.click();
      }
    }
  }

}
