import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NetworksService {

  httpOptions = new HttpHeaders({
    'Content-Type':  'application/json'
  });

  constructor(private http: HttpClient) { }

  connect(data): Observable<any> {
    data.port = 443;
   
    return this.http.put<any>(environment.apiServer + `/network`, data, { headers: this.httpOptions, responseType: 'text' as 'json'});
  }

  create(): Observable<any> {
    return this.http.get<any>(environment.apiServer + `/network`);
  }
}
