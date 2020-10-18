import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from './shared/components/main-layout/main-layout.component';
import {HomePageComponent} from './home-page/home-page.component';
import {AccessDeniedComponent} from './shared/components/access-denied/access-denied.component';


const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      // { path: '', redirectTo: '/admin/user', pathMatch: 'full' },
      {path: '', component: HomePageComponent},
      {path: 'access-denied', component: AccessDeniedComponent}
    ]
  },
  {
    // path: 'admin', loadChildren: './admin/admin.module#AdminModule'
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'memo/delivery', loadChildren: () => import('./memo-of-delivery/memo-of-delivery.module').then(m => m.MemoOfDeliveryModule)
  },
  {
    path: 'memo/dispatch', loadChildren: () => import('./memo-of-dispatch/memo-of-dispatch.module').then(m => m.MemoOfDispatchModule)
  },
  {
    path: 'delivery', loadChildren: () => import('./delivery-of-wagon/delivery-of-wagon.module').then(m => m.DeliveryOfWagonModule)
  },
  {
    path: 'reference', loadChildren: () => import('./reference/reference.module').then(m => m.ReferenceModule)
  },
  {
    path: 'controller-statement',
    loadChildren: () => import('./controller-statement/controller-statement.module').then(m => m.ControllerStatementModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
