import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStatementComponent } from './form-statement.component';

describe('EditUserComponent', () => {
  let component: FormStatementComponent;
  let fixture: ComponentFixture<FormStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
