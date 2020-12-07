import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListWagonGroupComponent} from './list-wagon-group.component';

describe('DeliveryOfWagonComponent', () => {
    let component: ListWagonGroupComponent;
    let fixture: ComponentFixture<ListWagonGroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListWagonGroupComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListWagonGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
