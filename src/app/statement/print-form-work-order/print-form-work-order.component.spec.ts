import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrintFormWorkOrderComponent} from './print-form-work-order.component';

describe('PrintFormMemoComponent', () => {
    let component: PrintFormWorkOrderComponent;
    let fixture: ComponentFixture<PrintFormWorkOrderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrintFormWorkOrderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintFormWorkOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
