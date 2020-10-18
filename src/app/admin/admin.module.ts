import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AdminLayoutComponent} from './shared/components/admin-layout/admin-layout.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {ListUserComponent} from './user/list-user/list-user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {AuthGuard} from './shared/services/auth.guard';
import {FormUserComponent} from './user/edit-user/form-user.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    ListUserComponent,
    FormUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: MainLayoutComponent, children: [
          {path: '', redirectTo: '/admin/user', pathMatch: 'full' },
          {path: 'login', component: LoginPageComponent},
          {path: 'logout', component: LoginPageComponent},
          {path: 'user', component: ListUserComponent, canActivate: [AuthGuard]},
          {path: 'user/edit/:userId', component: FormUserComponent, canActivate: [AuthGuard]},
          {path: 'user/create', component: FormUserComponent, canActivate: [AuthGuard]}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AdminModule {

}
