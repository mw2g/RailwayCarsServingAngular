import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {MemoOfDispatchLayoutComponent} from './shared/components/memo-of-dispatch-layout/memo-of-dispatch-layout.component';
import {ListMemoOfDispatchComponent} from './list-memo/list-memo-of-dispatch.component';
import {FormMemoOfDispatchComponent} from './edit-memo/form-memo-of-dispatch.component';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {ListDeliveryInMemoOfDispatchComponent} from './list-delivery-in-memo-of-dispatch/list-delivery-in-memo-of-dispatch.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';
import { PrintFormMemoOfDispatchComponent } from './print-form-memo/print-form-memo-of-dispatch.component';
import {FilterMemoOfDispatchPipe} from './pipe/filterMemoOfDispatch.pipe';

@NgModule({
  declarations: [
    MemoOfDispatchLayoutComponent,
    ListMemoOfDispatchComponent,
    FormMemoOfDispatchComponent,
    ListDeliveryInMemoOfDispatchComponent,
    PrintFormMemoOfDispatchComponent,
    FilterMemoOfDispatchPipe,
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
          {path: '', component: ListMemoOfDispatchComponent, canActivate: [AuthGuard]},
          {path: 'edit/:memoOfDispatchId', component: FormMemoOfDispatchComponent, canActivate: [AuthGuard]},
          {path: 'create', component: FormMemoOfDispatchComponent, canActivate: [AuthGuard]},
          {path: 'print-form/:memoOfDispatchId', component: PrintFormMemoOfDispatchComponent, canActivate: [AuthGuard]},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MemoOfDispatchModule {

}
