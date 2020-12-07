import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../admin/shared/services/auth.service';

@Component({
    selector: 'app-statement-layout',
    templateUrl: './statement-layout.component.html',
    styleUrls: ['./statement-layout.component.scss']
})
export class StatementLayoutComponent implements OnInit {

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
