import { Component, OnInit } from '@angular/core';
import { TranslateServiceLocal } from '../../services/translate/translate.service';
import { Router, ActivatedRoute } from '@angular/router';

declare const alertify: any;

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesComponent implements OnInit {

  selected = 'EN';
  languages = [{
    img: "US",
    txt: "EN"
  }, {
    img: "CO",
    txt: "ES"
  }];

  constructor(
    private translateService: TranslateServiceLocal,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const lang = this.translateService.urlHasLang();
    if (lang) {
      this.selected = lang.toUpperCase();
    }
  }

  switchLanguage(lang) {
    lang = lang.toLowerCase();
    this.changeAlertifyLang(lang);
    let positionUrl = 0;
    if (this.translateService.urlHasLang()) {
      positionUrl = this.translateService.getPositionUrl(this.router.url, '/', 2);
    }
    const url = (this.router.url).substring(positionUrl + 1, this.router.url.length);
    if (url.length > 0) {
      this.router.navigate([lang + '/' + url]);
    } else {
      this.router.navigate(
        [lang]
      );
    }
  }

  changeAlertifyLang(lang) {
    let ok = '';
    let cancel = '';
    switch (lang) {
      case 'en':
        ok = 'Confirm'
        cancel = 'Cancel'
        break
      case 'es':
        ok = 'Confirmar'
        cancel = 'Cancelar'
        break
    }
    alertify.defaults.glossary.ok = ok;
    alertify.defaults.glossary.cancel = cancel;
  }

}
