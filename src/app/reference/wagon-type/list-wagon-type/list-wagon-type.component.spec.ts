import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListWagonTypeComponent} from './list-wagon-type.component';

describe('DeliveryOfWagonComponent', () => {
    let component: ListWagonTypeComponent;
    let fixture: ComponentFixture<ListWagonTypeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListWagonTypeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListWagonTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
