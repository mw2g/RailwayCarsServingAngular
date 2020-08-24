import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFormMemoComponent } from './print-form-memo.component';

describe('PrintFormMemoComponent', () => {
  let component: PrintFormMemoComponent;
  let fixture: ComponentFixture<PrintFormMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintFormMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFormMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
