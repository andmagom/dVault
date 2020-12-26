import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateServiceLocal } from 'src/app/services/translate/translate.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-code-qr',
  templateUrl: './code-qr.component.html',
  styleUrls: ['./code-qr.component.css']
})
export class CodeQRComponent implements OnInit {

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  constructor(
    private translateServiceLocal: TranslateServiceLocal,
    public dialogRef: MatDialogRef<CodeQRComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  download() {
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

  ngOnInit(): void { }

}
