
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { BASE_URL } from '../../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class KanbanBoardService {
  token: string;

  constructor(
    private router: Router, 
    private http: Http, 
    private authService: AuthService
) {}

    getMyData() {
        return this.http.get(`${BASE_URL}me`, this.requestOptions())
            .map(res => ((<Response>res).json())
            )
            .catch((err: Response) => {
                return Observable.throw(err.json());
            });
    }

    getAllUsers() {
        return this.http.get(`${BASE_URL}users`, this.requestOptions())
            .map(res => ((<Response>res).json())
            )
            .catch((err: Response) => {
                return Observable.throw(err.json());
            });
    }

    getAllTasks() {
        return this.http.get(`${BASE_URL}tasks`, this.requestOptions())
            .map(res => ((<Response>res).json())
            )
            .catch((err: Response) => {
                return Observable.throw(err.json());
            });
    }

    getAllTags() {
        return this.http.get(`${BASE_URL}tags`, this.requestOptions())
            .map(res => ((<Response>res).json())
            )
            .catch((err: Response) => {
                return Observable.throw(err.json());
            });
    }

    createNewTask(task) {
        return this.http.post(`${BASE_URL}task`, task, this.requestOptions())
            .map(res => ((<Response>res).json())
            )
            .catch((err: Response) => {
                return Observable.throw(err.json());
            });
    }

    updateTask(task_id, task) {
        return this.http.put(`${BASE_URL}task/${task_id}`, task, this.requestOptions())
            .map(res => ((<Response>res).json())
            )
            .catch((err: Response) => {
                return Observable.throw(err.json());
            });
    }


    requestOptions() {
        const token = this.authService.getToken();
        const headers = new Headers({ 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
        let requestOptions = new RequestOptions({ headers: headers });
        return requestOptions;
    }
}
