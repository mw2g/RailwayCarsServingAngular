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
import {PrintFormStatementComponent} from './print-form-controller-statement/print-form-statement.component';
import {FilterStatementPipe} from './pipe/filterStatement.pipe';
import {PrintFormPaymentStatementComponent} from './print-form-payment-statement/print-form-payment-statement.component';
import {PrintFormWorkOrderCalculationComponent} from './print-form-work-order-calculation/print-form-work-order-calculation.component';
import {PrintFormWorkOrderComponent} from './print-form-work-order/print-form-work-order.component';

@NgModule({
    declarations: [
        StatementLayoutComponent,
        ListStatementComponent,
        FormStatementComponent,
        ListMemoInStatementComponent,
        PrintFormStatementComponent,
        PrintFormPaymentStatementComponent,
        PrintFormWorkOrderCalculationComponent,
        PrintFormWorkOrderComponent,
        FilterStatementPipe
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
                    {
                        path: 'print-form-payment-statement/:statementId',
                        component: PrintFormPaymentStatementComponent,
                        canActivate: [AuthGuard]
                    },
                    {
                        path: 'print-form-work-order-calculation/:statementId',
                        component: PrintFormWorkOrderCalculationComponent,
                        canActivate: [AuthGuard]
                    },
                    {
                        path: 'print-form-work-order/:statementId',
                        component: PrintFormWorkOrderComponent,
                        canActivate: [AuthGuard]
                    },
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class StatementModule {

}
