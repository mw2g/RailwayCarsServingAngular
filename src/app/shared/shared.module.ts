import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {TokenInterceptor} from '../token-interceptor';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from './service/alert.service';
import {AlertComponent} from './components/alert/alert.component';
import {CommonModule} from '@angular/common';
import {AutofocusDirective} from './directive/autofocus.directive';
import {WeightPipe} from './pipe/weight.pipe';
// import {WaitInterceptor} from './wat-interceptor.service';
import {SearchPipe} from './pipe/search.pipe';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FilterDeliveryPipe} from './pipe/filterDelivery.pipe';
import {DeliveryOfWagonPaginationPipe} from './pipe/deliveryOfWagonPagination.pipe';
import {SortPipe} from './pipe/sort.pipe';

// import {QuillModule} from 'ngx-quill';

@NgModule({
    declarations: [
        AlertComponent,
        AutofocusDirective,
        WeightPipe,
        SearchPipe,
        FilterDeliveryPipe,
        SortPipe,
        DeliveryOfWagonPaginationPipe
    ],
    imports: [
        HttpClientModule,
        NgxWebstorageModule.forRoot(),
        NgbModule,
        CommonModule,
        ScrollingModule
        // QuillModule.forRoot()
    ],
    exports: [
        HttpClientModule,
        NgxWebstorageModule,
        NgbModule,
        AlertComponent,
        AutofocusDirective,
        WeightPipe,
        SearchPipe,
        FilterDeliveryPipe,
        SortPipe,
        ScrollingModule,
        DeliveryOfWagonPaginationPipe
        // QuillModule
    ],
    providers: [
        AuthGuard,
        AlertService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        // {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: WaitInterceptor,
        //   multi: true
        // }
    ]
})
export class SharedModule {
}
