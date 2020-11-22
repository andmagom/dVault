import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private crypto: CryptoService) { }

  public get currentUserValue() {
    return this.getLocalStorage('user_dvault');
  }

  getLocalStorage(name) {
    if (!localStorage.getItem(name)) {
      return null;
    }
    return this.crypto.get(environment.secretKey, localStorage.getItem(name));
  }

  setLocalStorage(name, user) {
    const encrypt = this.crypto.set(environment.secretKey, user);
    localStorage.setItem(name, `${encrypt}`);
  }

  login(data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(`${data.username}:${data.password}`)
      })
    };
    return this.http.get<any>(environment.apiServer + `/login`, httpOptions).pipe(map(user => user));
  }

  create(data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<any>(environment.apiServer + `/register`, data, httpOptions).pipe(map(user => user));
  }

  logout() {
    localStorage.removeItem('user_dvault');
    localStorage.removeItem('last_secret_dvault');
  }

  getGeneralHeaders() {
    if (!this.currentUserValue || !this.currentUserValue.token) {
      return {
        headers: new HttpHeaders().set('', '')
      };
    }
    return {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.currentUserValue.token)
    };
  }
}
