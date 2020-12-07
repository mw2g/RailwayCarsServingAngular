import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StatementLayoutComponent} from './statement-layout.component';

describe('AdminLayoutComponent', () => {
    let component: StatementLayoutComponent;
    let fixture: ComponentFixture<StatementLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StatementLayoutComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatementLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
