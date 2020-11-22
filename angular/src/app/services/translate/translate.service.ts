import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import * as enLang from 'src/assets/i18n/en.json';
import * as esLang from 'src/assets/i18n/es.json';

@Injectable({
  providedIn: 'root'
})
export class TranslateServiceLocal {

  constructor(private translate: TranslateService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      if (params.lang === undefined) {
        translate.setDefaultLang('en');
      } else {
        const lang = this.urlHasLang();
        if (lang) {
          translate.setDefaultLang(lang);
        } else {
          window.location.href = '/404';
        }
      }
    });
  }

  getPositionUrl(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  urlHasLang() {
    const url = window.location.pathname.split('/');
    if (url.length > 1) {
      const lang = url[1];
      if (lang === 'es' || lang === 'en') {
        return lang
      }
    }
    return false;
  }

  changeRedirect(redirectTo, islogin = false) {
    const url = this.urlHasLang();
    if (url) {
      redirectTo = "/" + url + "/" + redirectTo
    }
    if (islogin) {
      return window.location.href = `${redirectTo}`;
    }
    return this.router.navigate([redirectTo]);
  }

  public switchLanguage(lang) {
    this.translate.use(lang);
  }

  getTxtTranslated(path) {
    switch (this.translate.defaultLang) {
      case 'es':
        return this.getMessageFile((esLang as any).default, path)
      case 'en':
        return this.getMessageFile((enLang as any).default, path)
    }
  }

  getMessageFile(obj, give) {
    let result = obj;
    give.split(".").forEach((key) => {
      result = result[key];
    });
    return result;
  }
}