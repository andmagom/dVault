import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MaterialModule } from './material';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { CryptoService } from './services/crypto/crypto.service';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { SecretsComponent } from './components/secrets/secrets.component';
import { NetworksComponent } from './components/networks/networks.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { FormNetworkComponent } from './components/form-network/form-network.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { FormSecretComponent } from './components/form-secret/form-secret.component';
import { CodeQRComponent } from './components/code-qr/code-qr.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LanguagesComponent,
    SecretsComponent,
    NetworksComponent,
    TopMenuComponent,
    FormNetworkComponent,
    LoadingScreenComponent,
    FormSecretComponent,
    CodeQRComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxQRCodeModule,
    MaterialModule
  ],
  providers: [
    CryptoService
  ],
  entryComponents: [FormNetworkComponent, FormSecretComponent, CodeQRComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
