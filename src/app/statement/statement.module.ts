import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {StatementLayoutComponent} from './shared/components/statement-layout/statement-layout.component';
import {ListStatementComponent} from './list-statement/list-statement.component';
import {FormStatementComponent} from './edit-statement/form-statement.component';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {ListMemoInStatementComponent} from './list-memo-in-statement/list-memo-in-statement.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';
import {PrintFormStatementComponent} from './print-form-memo/print-form-statement.component';

@NgModule({
  declarations: [
    StatementLayoutComponent,
    ListStatementComponent,
    FormStatementComponent,
    ListMemoInStatementComponent,
    PrintFormStatementComponent
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
          {path: '', component: ListStatementComponent, canActivate: [AuthGuard]},
          {path: 'edit/:statementId', component: FormStatementComponent, canActivate: [AuthGuard]},
          {path: 'create', component: FormStatementComponent, canActivate: [AuthGuard]},
          {path: 'print-form/:statementId', component: PrintFormStatementComponent, canActivate: [AuthGuard]},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class StatementModule {

}
