import {Component, OnInit} from '@angular/core';
import {UserPayload} from './user.payload';
import {UserService} from './user.service.';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-users-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  // user$: Observable<UserPayload>;
  users: UserPayload[];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    }, error => {
      throwError(error);
    });
  }


}
