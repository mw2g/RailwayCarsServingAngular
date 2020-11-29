import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoginRequestPayload} from './login-request.payload';
import {AlertService} from '../../shared/service/alert.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  message: string;
  environment = environment;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.message = 'Пожалуйста введите данные';
      } else if (params['authFailed']) {
        this.message = 'Сессия истекла. Войдите заново';
      }
    });

    this.form = new FormGroup({
      username: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required, Validators.minLength(4)
      ])
    });
  }

  login(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    const loginRequestPayload: LoginRequestPayload = {
      username: this.form.value.username,
      password: this.form.value.password
    };

    this.authService.login(loginRequestPayload).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/']);
    }, () => {
      this.submitted = false;
    }, () => {
      this.alert.success('Авторизация');
    });

  }
}
