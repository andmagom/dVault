import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor(private loginService: LoginService) {}

  connect() {
    const options = { transports: ['websocket'] };
    this.socket = io(environment.apiSocket, options);
    const data = {
      nextId: '',
      lastId: ''
    };
    const dataUser = this.loginService.currentUserValue;
    data.nextId = dataUser.nextId;
    data.lastId = dataUser.lastId || dataUser.id;
    
    this.socket.on('connect', _ => {
      this.socket.emit('GetSecrets', data);
    });
    this.subscribeSecretFound = this.subscribeSecretFound.bind(this);
    this.subscribeSecretEnd = this.subscribeSecretEnd.bind(this);
    this.subscribeDisconnect = this.subscribeDisconnect.bind(this);
  }

  subscribeSecretFound() {
    return Observable.create((observer) => {
      this.socket.on('SecretFound', data => {observer.next(data);});
    });
  }

  subscribeSecretEnd() {
    return Observable.create((observer) => {
      this.socket.on('SecretEnd', data => observer.next(data));
    });
  }

  subscribeDisconnect() {
    return Observable.create((observer) => {
      this.socket.on('disconnect', data => observer.next(data));
    });
  }
}