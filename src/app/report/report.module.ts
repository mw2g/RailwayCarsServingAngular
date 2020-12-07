import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {AuthGuard} from '../admin/shared/services/auth.guard';
import {BriefStatisticalReportComponent} from './brief-statistical-report/brief-statistical-report.component';
import {MainLayoutComponent} from '../shared/components/main-layout/main-layout.component';

@NgModule({
    declarations: [
        BriefStatisticalReportComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '', component: MainLayoutComponent, children: [
                    {path: 'brief-statistical-report', component: BriefStatisticalReportComponent, canActivate: [AuthGuard]},
                ]
            },
            {
                path: '', component: MainLayoutComponent, children: [
                    {path: 'general-set-of-rail-services', component: BriefStatisticalReportComponent, canActivate: [AuthGuard]},
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class ReportModule {

}
