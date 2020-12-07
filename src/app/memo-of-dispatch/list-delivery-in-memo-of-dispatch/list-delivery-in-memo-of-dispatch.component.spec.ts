import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListDeliveryInMemoOfDispatchComponent} from './list-delivery-in-memo-of-dispatch.component';

describe('DeliveryOfWagonComponent', () => {
    let component: ListDeliveryInMemoOfDispatchComponent;
    let fixture: ComponentFixture<ListDeliveryInMemoOfDispatchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListDeliveryInMemoOfDispatchComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListDeliveryInMemoOfDispatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
