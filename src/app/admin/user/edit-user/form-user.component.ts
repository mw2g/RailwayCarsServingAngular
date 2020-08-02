import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from '../user.service.';
import {map, switchMap} from 'rxjs/operators';
import {UserPayload} from '../user.payload';
import {AlertService} from '../../shared/services/alert.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  form: FormGroup;
  user: UserPayload;
  submitted = false;

  uSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private alert: AlertService
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.userService.getById(params['userId']);
      })
    ).subscribe((user: UserPayload) => {
      this.user = user;
      this.form = new FormGroup({
        userId: new FormControl(user.userId, Validators.required),
        username: new FormControl(user.username, Validators.required),
        password: new FormControl(user.password, Validators.required),
        email: new FormControl(user.email, Validators.required),
        firstName: new FormControl(user.firstName, Validators.required),
        middleName: new FormControl(user.middleName, Validators.required),
        lastName: new FormControl(user.lastName, Validators.required),
        created: new FormControl(new Date(user.created * 1000), Validators.required),
        enabled: new FormControl(user.enabled, Validators.required)
      });
    });
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    this.uSub = this.userService.update({
      ...this.user,
      username: this.form.value.username,
      password: this.form.value.password,
      email: this.form.value.email,
      firstName: this.form.value.firstName,
      middleName: this.form.value.middleName,
      lastName: this.form.value.lastName,
      enabled: this.form.value.enabled,
    }).subscribe((data) => {
      this.alert.success(data.message);
      this.submitted = true;
    }, () => {
      this.alert.danger('Ошибка');
    });

  }

}
