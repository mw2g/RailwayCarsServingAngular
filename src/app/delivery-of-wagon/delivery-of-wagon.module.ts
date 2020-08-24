import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {DeliveryOfWagonLayoutComponent} from './shared/components/delivery-of-wagon-layout/delivery-of-wagon-layout.component';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {ListDeliveryOfWagonComponent} from './list-delivery/list-delivery-of-wagon.component';
import {FormDeliveryOfWagonComponent} from './edit-delivery/form-delivery-of-wagon.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';

@NgModule({
  declarations: [
    DeliveryOfWagonLayoutComponent,
    ListDeliveryOfWagonComponent,
    FormDeliveryOfWagonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: MainLayoutComponent, children: [
          // {path: '', redirectTo: '/delivery', pathMatch: 'full' },
          {path: '', component: ListDeliveryOfWagonComponent, canActivate: [AuthGuard]},
          {path: 'edit/:deliveryId', component: FormDeliveryOfWagonComponent, canActivate: [AuthGuard]},
          {path: 'create', component: FormDeliveryOfWagonComponent, canActivate: [AuthGuard]},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class DeliveryOfWagonModule {

}
