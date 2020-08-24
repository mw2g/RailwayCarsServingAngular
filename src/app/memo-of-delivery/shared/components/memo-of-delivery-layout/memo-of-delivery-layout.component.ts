import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import {AuthService} from '../../../../admin/shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './memo-of-delivery-layout.component.html',
  styleUrls: ['./memo-of-delivery-layout.component.scss']
})
export class MemoOfDeliveryLayoutComponent implements OnInit {

  constructor(
    public router: Router,
    public authService: AuthService,
    // private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}
