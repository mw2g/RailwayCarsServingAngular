import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSettingComponent} from './list-setting.component';

describe('DeliveryOfWagonComponent', () => {
    let component: ListSettingComponent;
    let fixture: ComponentFixture<ListSettingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListSettingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListSettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
