import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerStatementLayoutComponent } from './controller-statement-layout.component';

describe('AdminLayoutComponent', () => {
  let component: ControllerStatementLayoutComponent;
  let fixture: ComponentFixture<ControllerStatementLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerStatementLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerStatementLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
