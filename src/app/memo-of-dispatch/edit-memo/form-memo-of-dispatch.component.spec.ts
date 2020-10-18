import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMemoOfDispatchComponent } from './form-memo-of-dispatch.component';

describe('EditUserComponent', () => {
  let component: FormMemoOfDispatchComponent;
  let fixture: ComponentFixture<FormMemoOfDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMemoOfDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMemoOfDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
