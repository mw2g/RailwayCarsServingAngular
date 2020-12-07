import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrintFormPaymentStatementComponent} from './print-form-payment-statement.component';

describe('PrintFormMemoComponent', () => {
    let component: PrintFormPaymentStatementComponent;
    let fixture: ComponentFixture<PrintFormPaymentStatementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrintFormPaymentStatementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintFormPaymentStatementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
