import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFormStatementComponent } from './print-form-statement.component';

describe('PrintFormMemoComponent', () => {
  let component: PrintFormStatementComponent;
  let fixture: ComponentFixture<PrintFormStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintFormStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFormStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
