import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {ControllerStatementLayoutComponent} from './shared/components/controller-statement-layout/controller-statement-layout.component';
import {ListControllerStatementComponent} from './list-statement/list-controller-statement.component';
import {FormControllerStatementComponent} from './edit-statement/form-controller-statement.component';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {ListMemoInControllerStatementComponent} from './list-memo-in-controller-statement/list-memo-in-controller-statement.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';
import { PrintFormControllerStatementComponent } from './print-form-memo/print-form-controller-statement.component';

@NgModule({
  declarations: [
    ControllerStatementLayoutComponent,
    ListControllerStatementComponent,
    FormControllerStatementComponent,
    ListMemoInControllerStatementComponent,
    PrintFormControllerStatementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: MainLayoutComponent, children: [
          // {path: '', redirectTo: '/memo/delivery', pathMatch: 'full' },
          {path: '', component: ListControllerStatementComponent, canActivate: [AuthGuard]},
          {path: 'edit/:statementId', component: FormControllerStatementComponent, canActivate: [AuthGuard]},
          {path: 'create', component: FormControllerStatementComponent, canActivate: [AuthGuard]},
          {path: 'print-form/:statementId', component: PrintFormControllerStatementComponent, canActivate: [AuthGuard]},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ControllerStatementModule {

}
