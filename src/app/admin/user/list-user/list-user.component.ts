import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service.';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../../../shared/interfaces';
import {AlertService} from '../../../shared/service/alert.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy {

  // user$: Observable<UserPayload>;
  users: User[] = [];
  userIdToDelete: number;
  refreshTokenIdToKickOut: number;
  usersSub: Subscription;
  delSub: Subscription;
  kickSub: Subscription;

  constructor(private userService: UserService,
              public router: Router,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.usersSub = this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    }, error => {
      throwError(error);
    });
  }

  ngOnDestroy(): void {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
    if (this.kickSub) {
      this.kickSub.unsubscribe();
    }
  }

  delete(): void {
    this.delSub = this.userService.delete(this.userIdToDelete).subscribe((data) => {
      this.alert.success(data.message);
      this.users = this.users.filter(user => user.userId !== this.userIdToDelete);
      // this.router.navigate(['/admin', 'user']);
      this.unsetDelete();
    }, () => {
      this.alert.danger('Ошибка');
    }, () => {
      this.alert.success('Пользователь удален');
    });
  }

  setDelete(userId: number): void {
    this.userIdToDelete = userId;
  }

  unsetDelete(): void {
    this.userIdToDelete = null;
  }

  getById(userId: number): string {
    if (userId) {
      return this.users.find(value => value.userId === userId).username;
    }
    return '';
  }

  kickOut(): void {
    this.kickSub = this.userService.kickOut(this.refreshTokenIdToKickOut).subscribe((data) => {
      this.alert.warning(data.message);
      this.users.map(user => {
        user.auths = user.auths.filter(auth => auth.refreshTokenId !== this.refreshTokenIdToKickOut);
      });
      this.unSetTokenToKickOut();
    }, () => {
      this.alert.danger('Ошибка при отправке запроса');
    });
  }

  setTokenToKickOut(refreshTokenId: number): void {
    this.refreshTokenIdToKickOut = refreshTokenId;
  }

  unSetTokenToKickOut(): void {
    this.refreshTokenIdToKickOut = null;
  }
}
