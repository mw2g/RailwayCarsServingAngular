import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMemoOfDeliveryComponent } from './form-memo-of-delivery.component';

describe('EditUserComponent', () => {
  let component: FormMemoOfDeliveryComponent;
  let fixture: ComponentFixture<FormMemoOfDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMemoOfDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMemoOfDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
