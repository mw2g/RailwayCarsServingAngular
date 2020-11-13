import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserService} from '../user.service.';
import {switchMap} from 'rxjs/operators';
import {User} from 'src/app/shared/interfaces';
import {AlertService} from '../../../shared/service/alert.service';
import {UtilsService} from '../../../shared/service/utils.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit, OnDestroy {

  form: FormGroup;
  user: User;
  uSub: Subscription;
  cSub: Subscription;
  iSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public router: Router,
    private alert: AlertService,
    private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.iSub = this.route.params.pipe(
      switchMap((params: Params) => {
        if (params.userId) {
          return this.userService.getById(params.userId);
        } else {
          this.initEmptyForm();
          return new Observable<User>();
        }
      })
    ).subscribe((user: User) => {
      this.user = user;
      this.form = new FormGroup({
        userId: new FormControl(user.userId, Validators.required),
        username: new FormControl(user.username, Validators.required),
        password: new FormControl(user.password, Validators.required),
        email: new FormControl(user.email),
        firstName: new FormControl(user.firstName, Validators.required),
        middleName: new FormControl(user.middleName, Validators.required),
        lastName: new FormControl(user.lastName, Validators.required),
        created: new FormControl(new Date(user.created), Validators.required),
        enabled: new FormControl(user.enabled),
        adminRole: new FormControl(user.roles.find(role => role === 'ROLE_ADMIN')),
        userRole: new FormControl(user.roles.find(role => role === 'ROLE_USER')),
        watchRole: new FormControl(user.roles.find(role => role === 'ROLE_WATCH'))
      });
    });
  }


  loadForm(): void {
    this.form = new FormGroup({
      userId: new FormControl(this.user.userId),
      username: new FormControl(this.user.username),
      password: new FormControl(this.user.password),
      email: new FormControl(this.user.email),
      firstName: new FormControl(this.user.firstName),
      middleName: new FormControl(this.user.middleName),
      lastName: new FormControl(this.user.lastName),
      created: new FormControl(new Date(this.user.created)),
      enabled: new FormControl(this.user.enabled),
      adminRole: new FormControl(this.user.roles.find(role => role === 'ROLE_ADMIN')),
      userRole: new FormControl(this.user.roles.find(role => role === 'ROLE_USER')),
      watchRole: new FormControl(this.user.roles.find(role => role === 'ROLE_WATCH'))
    });
  }

  initEmptyForm(): void {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      enabled: new FormControl(true),
      adminRole: new FormControl(false),
      userRole: new FormControl(true),
      watchRole: new FormControl(false)
    });
  }

  create(): void {
    if (this.utils.checkForm(this.alert, this.form)) {
      return;
    }
    const roles = this.setRoles();
    this.cSub = this.userService.create({
      ...this.user,
      username: this.form.value.username,
      password: this.form.value.password,
      email: this.form.value.email,
      firstName: this.form.value.firstName,
      middleName: this.form.value.middleName,
      lastName: this.form.value.lastName,
      enabled: this.form.value.enabled,
      roles
    }).subscribe((data) => {
      this.alert.success('Пользователь создан');
      this.form.addControl('userId', new FormControl(data.userId));
      this.form.addControl('created', new FormControl(new Date(data.created)));
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.form.markAsPristine();
    });
  }

  private setRoles(): string[] {
    const roles: string[] = [];
    if (this.form.value.adminRole) {
      roles.push('ROLE_ADMIN');
    }
    if (this.form.value.userRole) {
      roles.push('ROLE_USER');
    }
    if (this.form.value.watchRole) {
      roles.push('ROLE_WATCH');
    }
    return roles;
  }

  update(): void {
    if (this.utils.checkForm(this.alert, this.form)) {
      return;
    }
    const roles = this.setRoles();
    this.uSub = this.userService.update({
      ...this.user,
      username: this.form.value.username,
      password: this.form.value.password,
      email: this.form.value.email,
      firstName: this.form.value.firstName,
      middleName: this.form.value.middleName,
      lastName: this.form.value.lastName,
      enabled: this.form.value.enabled,
      roles
    }).subscribe((data) => {
      this.alert.success(data.message);
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.user.username = this.form.value.username;
      this.user.password = this.form.value.password;
      this.user.email = this.form.value.email;
      this.user.firstName = this.form.value.firstName;
      this.user.middleName = this.form.value.middleName;
      this.user.lastName = this.form.value.lastName;
      this.user.enabled = this.form.value.enabled;
      this.user.roles = this.setRoles();
      this.form.markAsPristine();
    });

  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
    if (this.iSub) {
      this.iSub.unsubscribe();
    }
  }
}
