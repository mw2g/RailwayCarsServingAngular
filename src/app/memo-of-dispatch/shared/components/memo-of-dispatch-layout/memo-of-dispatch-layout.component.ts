import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../admin/shared/services/auth.service';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './memo-of-dispatch-layout.component.html',
    styleUrls: ['./memo-of-dispatch-layout.component.scss']
})
export class MemoOfDispatchLayoutComponent implements OnInit {

    constructor(
        public router: Router,
        public authService: AuthService,
        // private localStorage: LocalStorageService
    ) {
    }

    ngOnInit(): void {
    }

    logout(event: Event): void {
        event.preventDefault();
        this.authService.logout();
    }
}
