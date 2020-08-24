import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {ReferenceLayoutComponent} from './shared/components/reference-layout/reference-layout.component';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {ListCustomerComponent} from './customer/list-customer/list-customer.component';
import {FormCustomerComponent} from './customer/edit-customer/form-customer.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';
import {ListSignerInCustomerComponent} from './customer/list-signer-in-customer/list-signer-in-customer.component';

@NgModule({
  declarations: [
    ReferenceLayoutComponent,
    ListCustomerComponent,
    FormCustomerComponent,
    ListSignerInCustomerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'customer', component: MainLayoutComponent, children: [
          // {path: '', redirectTo: '/delivery', pathMatch: 'full' },
          {path: '', component: ListCustomerComponent, canActivate: [AuthGuard]},
          {path: 'edit/:customerId', component: FormCustomerComponent, canActivate: [AuthGuard]},
          {path: 'create', component: FormCustomerComponent, canActivate: [AuthGuard]},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ReferenceModule {

}
