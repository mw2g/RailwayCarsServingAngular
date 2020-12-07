import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service.';
import {Subscription, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../../../shared/interfaces';
import {AlertService} from '../../../shared/service/alert.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-users-page',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy {

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
            if (error instanceof HttpErrorResponse
                && error.status === 404) {
                console.log('Access denied');
                this.router.navigate(['/access-denied']);
            }
            throwError(error);
        });
    }

    getById(userId: number): string {
        if (userId) {
            return this.users.find(value => value.userId === userId).username;
        }
        return '';
    }

    delete(): void {
        this.delSub = this.userService.delete(this.userIdToDelete).subscribe(() => {
            this.users = this.users.filter(user => user.userId !== this.userIdToDelete);
            this.unsetDelete();
        }, () => {
            this.alert.danger('Ошибка при удалении пользователя');
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

    kickOut(): void {
        this.kickSub = this.userService.kickOut(this.refreshTokenIdToKickOut).subscribe(() => {
            this.users.map(user => {
                user.auths = user.auths.filter(auth => auth.refreshTokenId !== this.refreshTokenIdToKickOut);
            });
            this.unSetTokenToKickOut();
        }, () => {
            this.alert.danger('Ошибка при удалении сеанса');
        }, () => {
            this.alert.success('Сеанс удален');
        });
    }

    setTokenToKickOut(refreshTokenId: number): void {
        this.refreshTokenIdToKickOut = refreshTokenId;
    }

    unSetTokenToKickOut(): void {
        this.refreshTokenIdToKickOut = null;
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
}
