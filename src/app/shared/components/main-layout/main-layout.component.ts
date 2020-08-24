import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../admin/shared/services/auth.service';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private router: Router,
    public authService: AuthService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    // this.router.navigate(['/admin', 'login']);
  }
}
