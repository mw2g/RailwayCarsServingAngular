import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BriefStatisticalReportComponent} from './brief-statistical-report.component';

describe('PrintFormMemoComponent', () => {
    let component: BriefStatisticalReportComponent;
    let fixture: ComponentFixture<BriefStatisticalReportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BriefStatisticalReportComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BriefStatisticalReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
