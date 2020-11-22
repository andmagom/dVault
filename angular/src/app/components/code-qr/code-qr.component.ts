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

  ngOnInit(): void {}

}
