import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
// import {ReferenceLayoutComponent} from './shared/components/reference-layout/reference-layout.component';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {ListCustomerComponent} from './customer/list-customer/list-customer.component';
import {FormCustomerComponent} from './customer/edit-customer/form-customer.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';
import {ListSignerInCustomerComponent} from './customer/list-signer-in-customer/list-signer-in-customer.component';
import {FormCargoTypeComponent} from './cargo-type/edit-cargo-type-NOT-USING/form-cargo-type.component';
import {ListCargoTypeComponent} from './cargo-type/list-cargo-type/list-cargo-type.component';
import {ListWagonGroupComponent} from './wagon-group/list-wagon-group/list-wagon-group.component';
import {ListBaseRateComponent} from './base-rate/list-base-rate/list-base-rate.component';
import {ListWagonTypeComponent} from './wagon-type/list-wagon-type/list-wagon-type.component';
import {ListCargoOperationComponent} from './cargo-operation/list-cargo-operation/list-cargo-operation.component';
import {ListIndexToBaseRateComponent} from './index-to-base-rate/list-base-rate/list-index-to-base-rate.component';
import {ListTimeNormTypeComponent} from './time-norm-type/list-wagon-group/list-time-norm-type.component';
import {ListTimeNormComponent} from './time-norm/list-time-norm/list-time-norm.component';
import {ListTariffTypeComponent} from './tariff-type/list-tariff-type/list-tariff-type.component';
import {ListTariffComponent} from './tariff/list-tariff/list-tariff.component';
import {ListPenaltyComponent} from './penalty/list-penalty/list-penalty.component';

@NgModule({
  declarations: [
    // ReferenceLayoutComponent,
    ListCustomerComponent,
    FormCustomerComponent,
    ListSignerInCustomerComponent,
    FormCargoTypeComponent,
    ListCargoTypeComponent,
    ListWagonGroupComponent,
    ListBaseRateComponent,
    ListWagonTypeComponent,
    ListCargoOperationComponent,
    ListIndexToBaseRateComponent,
    ListTimeNormTypeComponent,
    ListTimeNormComponent,
    ListTariffTypeComponent,
    ListTariffComponent,
    ListPenaltyComponent
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
      },
      {
        path: 'cargo-type', component: MainLayoutComponent, children: [
          // {path: '', redirectTo: '/delivery', pathMatch: 'full' },
          {path: '', component: ListCargoTypeComponent, canActivate: [AuthGuard]},
          {path: 'edit/:typeId', component: FormCargoTypeComponent, canActivate: [AuthGuard]},
          {path: 'create', component: FormCargoTypeComponent, canActivate: [AuthGuard]},
        ]
      },
      {
        path: 'config/wagon-group', component: MainLayoutComponent, children: [
          {path: '', component: ListWagonGroupComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/cargo-operation', component: MainLayoutComponent, children: [
          {path: '', component: ListCargoOperationComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/wagon-type', component: MainLayoutComponent, children: [
          {path: '', component: ListWagonTypeComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/base-rate', component: MainLayoutComponent, children: [
          {path: '', component: ListBaseRateComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/time-norm-type', component: MainLayoutComponent, children: [
          {path: '', component: ListTimeNormTypeComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/time-norm', component: MainLayoutComponent, children: [
          {path: '', component: ListTimeNormComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/tariff-type', component: MainLayoutComponent, children: [
          {path: '', component: ListTariffTypeComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/tariff', component: MainLayoutComponent, children: [
          {path: '', component: ListTariffComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/penalty', component: MainLayoutComponent, children: [
          {path: '', component: ListPenaltyComponent, canActivate: [AuthGuard]}
        ]
      },
      {
        path: 'config/index-to-base-rate', component: MainLayoutComponent, children: [
          {path: '', component: ListIndexToBaseRateComponent, canActivate: [AuthGuard]}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ReferenceModule {

}
