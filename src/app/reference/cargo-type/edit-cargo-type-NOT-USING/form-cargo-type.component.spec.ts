import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormCargoTypeComponent} from './form-cargo-type.component';

describe('FormDeliveryOfWagonComponent', () => {
    let component: FormCargoTypeComponent;
    let fixture: ComponentFixture<FormCargoTypeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormCargoTypeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormCargoTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
