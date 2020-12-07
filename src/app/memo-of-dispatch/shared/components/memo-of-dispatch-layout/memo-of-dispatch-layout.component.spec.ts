import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MemoOfDispatchLayoutComponent} from './memo-of-dispatch-layout.component';

describe('AdminLayoutComponent', () => {
    let component: MemoOfDispatchLayoutComponent;
    let fixture: ComponentFixture<MemoOfDispatchLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemoOfDispatchLayoutComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MemoOfDispatchLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
