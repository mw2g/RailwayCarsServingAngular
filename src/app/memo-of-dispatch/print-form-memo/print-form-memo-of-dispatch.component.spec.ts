import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrintFormMemoOfDispatchComponent} from './print-form-memo-of-dispatch.component';

describe('PrintFormMemoComponent', () => {
    let component: PrintFormMemoOfDispatchComponent;
    let fixture: ComponentFixture<PrintFormMemoOfDispatchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PrintFormMemoOfDispatchComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintFormMemoOfDispatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
