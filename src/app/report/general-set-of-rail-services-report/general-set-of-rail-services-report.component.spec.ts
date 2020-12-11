import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GeneralSetOfRailServicesReportComponent} from './general-set-of-rail-services-report.component';

describe('PrintFormMemoComponent', () => {
    let component: GeneralSetOfRailServicesReportComponent;
    let fixture: ComponentFixture<GeneralSetOfRailServicesReportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GeneralSetOfRailServicesReportComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GeneralSetOfRailServicesReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
