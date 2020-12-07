import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReferenceLayoutComponent} from './reference-layout.component';

describe('AdminLayoutComponent', () => {
    let component: ReferenceLayoutComponent;
    let fixture: ComponentFixture<ReferenceLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReferenceLayoutComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReferenceLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
