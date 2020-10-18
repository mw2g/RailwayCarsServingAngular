import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFormControllerStatementComponent } from './print-form-controller-statement.component';

describe('PrintFormMemoComponent', () => {
  let component: PrintFormControllerStatementComponent;
  let fixture: ComponentFixture<PrintFormControllerStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintFormControllerStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFormControllerStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
