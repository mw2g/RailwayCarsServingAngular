import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListTariffComponent} from './list-tariff.component';

describe('DeliveryOfWagonComponent', () => {
    let component: ListTariffComponent;
    let fixture: ComponentFixture<ListTariffComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListTariffComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListTariffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
