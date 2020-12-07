import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListDeliveryInMemoOfDeliveryComponent} from './list-delivery-in-memo-of-delivery.component';

describe('DeliveryOfWagonComponent', () => {
    let component: ListDeliveryInMemoOfDeliveryComponent;
    let fixture: ComponentFixture<ListDeliveryInMemoOfDeliveryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListDeliveryInMemoOfDeliveryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListDeliveryInMemoOfDeliveryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
