import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSignerInCustomerComponent} from './list-signer-in-customer.component';

describe('DeliveryOfWagonComponent', () => {
    let component: ListSignerInCustomerComponent;
    let fixture: ComponentFixture<ListSignerInCustomerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListSignerInCustomerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListSignerInCustomerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
