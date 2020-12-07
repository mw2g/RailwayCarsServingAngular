import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrintFormMemoOfDeliveryComponent} from './print-form-memo-of-delivery.component';

describe('PrintFormMemoComponent', () => {
    let component: PrintFormMemoOfDeliveryComponent;
    let fixture: ComponentFixture<PrintFormMemoOfDeliveryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrintFormMemoOfDeliveryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintFormMemoOfDeliveryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
