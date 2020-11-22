import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login/login.service';
import { TranslateServiceLocal } from '../translate/translate.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  
  constructor(private loginService: LoginService, private translateService: TranslateServiceLocal) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const dataUser = this.loginService.currentUserValue;
    if(dataUser) {
      return true;
    }
    this.translateService.changeRedirect('/login');
    return false;
  }
  
}
