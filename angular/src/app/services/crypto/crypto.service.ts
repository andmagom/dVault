import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  set(keys, value) {
    return CryptoJS.AES.encrypt(JSON.stringify(value), keys);
  }

  get(keys, value) {
    const bytes  = CryptoJS.AES.decrypt(value.toString(), keys);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}
