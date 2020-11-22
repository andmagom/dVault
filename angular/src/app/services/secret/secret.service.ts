import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  httpOptions = new HttpHeaders({
    'Content-Type':  'application/json'
  });

  constructor(private http: HttpClient) { }

  create(data): Observable<any> {
    return this.http.post<any>(environment.apiServer + `/secret`, data, { headers: this.httpOptions, responseType: 'text' as 'json'});
  }
}
