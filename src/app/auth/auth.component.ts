
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'auth-page',
  templateUrl: './auth.html', 
  styleUrls: ['./auth.scss']
})
export class AuthComponent implements OnInit, AfterViewInit{
  authType: String = '';
  title: String = '';
  authForm: FormGroup;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.authForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(route => {
        // Get the last piece of the URL (it's either 'login' or 'register')
        this.authType = route[route.length - 1].path;
        // Set a title for the page accordingly
        this.title = (this.authType === 'login') ? 'Login' : 'Register';
        // add form control for username if this is the register page
        if (this.authType === 'register') {
            this.authForm.addControl('name', new FormControl('', Validators.required));
        }
    });
  }

  ngAfterViewInit() {
    this.authForm.controls.username.updateValueAndValidity();
    this.authForm.controls.password.updateValueAndValidity();
  }

  submitForm() {
  
    let credentials = this.authForm.value;

    if(this.authType === 'login') {
      this.authService.login(credentials)
      .subscribe(
        response => {
          if(response.data) 
            this.router.navigate(['kanban-board']);
        },
        error => {
          console.log(error);
        }
      );
    } else {
        this.authService.signup(credentials)
        .subscribe(
          response => {
            if(response.data) 
              this.router.navigate(['kanban-board']);
          },
          error => {
            console.log(error);
          }
        );
    }
  }
}