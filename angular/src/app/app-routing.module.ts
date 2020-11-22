import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SecretsComponent } from './components/secrets/secrets.component';
import { NetworksComponent } from './components/networks/networks.component';

import { GuardGuard } from './services/guard/guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'networks', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: ':lang/login', component: LoginComponent },
  { path: 'secrets', component: SecretsComponent, canActivate: [GuardGuard] },
  { path: ':lang/secrets', component: SecretsComponent, canActivate: [GuardGuard] },
  { path: 'networks', component: NetworksComponent },
  { path: ':lang/networks', component: NetworksComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
