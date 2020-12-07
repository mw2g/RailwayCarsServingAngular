import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListIndexToBaseRateComponent} from './list-index-to-base-rate.component';

describe('DeliveryOfWagonComponent', () => {
    let component: ListIndexToBaseRateComponent;
    let fixture: ComponentFixture<ListIndexToBaseRateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListIndexToBaseRateComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListIndexToBaseRateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
