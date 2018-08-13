
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { BASE_URL } from '../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class AuthService {
  token: string;

  constructor(
    private router: Router, 
    private http: Http
) {}

  signup(user) {
    return this.http.post(`${BASE_URL}signup`, user, this.requestOptions())
        .map(res => {
            const data = res.json();
            if (data.token) {
                localStorage.setItem('securityToken', data.token);
                localStorage.setItem('username', user.username);
            }
        })
        .catch((err: Response) => {
            return Observable.throw(err.json());
        });
  }

  login(user) {
    return this.http.post(`${BASE_URL}signin`, user, this.requestOptions())
        .map(res => {
            if (res.json().data.token) {
                localStorage.setItem('securityToken', res.json().data.token);
                localStorage.setItem('username', user.username);
                this.token = res.json().data.token;
            }
            return (<Response>res).json();
        })
        .catch((err: Response) => {
            return Observable.throw(err.json());
        });
  }


  requestOptions() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    let requestOptions = new RequestOptions({ headers: headers });
    return requestOptions;
}

  getToken() {
    const token = localStorage.getItem('securityToken');
    return token;
  }

  isAuthenticated() {
    return this.getToken() != null;
  }
}
