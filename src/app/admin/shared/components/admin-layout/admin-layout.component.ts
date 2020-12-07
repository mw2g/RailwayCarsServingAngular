import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

    constructor(
        public router: Router,
        public authService: AuthService,
        private localStorage: LocalStorageService
    ) {
    }

    ngOnInit(): void {
    }

    logout(event: Event): void {
        event.preventDefault();
        this.authService.logout();
    }
}
