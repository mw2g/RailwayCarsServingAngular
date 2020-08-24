import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {MemoOfDeliveryLayoutComponent} from './shared/components/memo-of-delivery-layout/memo-of-delivery-layout.component';
import {ListMemoOfDeliveryComponent} from './list-memo/list-memo-of-delivery.component';
import {FormMemoOfDeliveryComponent} from './edit-memo/form-memo-of-delivery.component';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {ListDeliveryInMemoOfDeliveryComponent} from './list-delivery-in-memo-of-delivery/list-delivery-in-memo-of-delivery.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';
import { PrintFormMemoComponent } from './print-form-memo/print-form-memo.component';

@NgModule({
  declarations: [
    MemoOfDeliveryLayoutComponent,
    ListMemoOfDeliveryComponent,
    FormMemoOfDeliveryComponent,
    ListDeliveryInMemoOfDeliveryComponent,
    PrintFormMemoComponent
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
          {path: '', component: ListMemoOfDeliveryComponent, canActivate: [AuthGuard]},
          {path: 'edit/:memoId', component: FormMemoOfDeliveryComponent, canActivate: [AuthGuard]},
          {path: 'create', component: FormMemoOfDeliveryComponent, canActivate: [AuthGuard]},
          {path: 'print-form/:memoId', component: PrintFormMemoComponent, canActivate: [AuthGuard]},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MemoOfDeliveryModule {

}
