import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrintFormWorkOrderCalculationComponent} from './print-form-work-order-calculation.component';

describe('PrintFormMemoComponent', () => {
    let component: PrintFormWorkOrderCalculationComponent;
    let fixture: ComponentFixture<PrintFormWorkOrderCalculationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrintFormWorkOrderCalculationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintFormWorkOrderCalculationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
