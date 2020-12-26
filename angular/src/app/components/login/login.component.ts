import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { MessagesService } from '../../services/messages/messages.service';
import { TranslateServiceLocal } from '../../services/translate/translate.service';

declare const alertify: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessagesService, TranslateServiceLocal],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  mode = 'login';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private messagesService: MessagesService,
    private translateService: TranslateServiceLocal
  ) {
    if (this.loginService.currentUserValue) {
       this.translateService.changeRedirect('/secrets');
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    if(this.mode === 'login') {
      this.sendLoading();
    } else {
      this.register();
    }

  }

  sendLoading() {
    this.loading = true;

    this.loginService.login(this.loginForm.value).subscribe(user => {
      console.log(user);
      this.loginService.setLocalStorage('user_dvault', user.metadata);
      this.loading = false;
      this.translateService.changeRedirect('/secrets');
    }, err => {
      this.messagesService.showErrorNotification(err.error.error);
      this.loading = false;
    });
  }

  register() {
    const data = {
      "content": {
        "date": new Date()
      },
      "username": this.loginForm.value.username,
      "password": this.loginForm.value.password
    }
    this.loading = true;
    this.loginService.create(data).subscribe(res => {
      this.loading = false;
      this.loginService.setLocalStorage('user_dvault_register', res);
      this.loginService.setLocalStorage('last_secret_dvault', res);
      this.loginService.setLocalStorage('user_dvault', res);
      this.translateService.changeRedirect('/secrets');
    }, err => {
      this.messagesService.showErrorNotification(err.error.error);
      this.loading = false;
    });
    // this.loginService.setLocalStorage('user_dvault_register', this.loginForm.value);
    // this.translateService.changeRedirect('/secrets');
  }

  changeMode() {
    if(this.mode === 'login') {
      this.mode = 'register';
    } else {
      this.mode = 'login';
    }
  }
}
