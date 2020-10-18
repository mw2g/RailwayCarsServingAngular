import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControllerStatementComponent } from './form-controller-statement.component';

describe('EditUserComponent', () => {
  let component: FormControllerStatementComponent;
  let fixture: ComponentFixture<FormControllerStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormControllerStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControllerStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
