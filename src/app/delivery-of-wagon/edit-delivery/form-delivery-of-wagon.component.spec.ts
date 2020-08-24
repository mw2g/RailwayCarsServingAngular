import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDeliveryOfWagonComponent } from './form-delivery-of-wagon.component';

describe('FormDeliveryOfWagonComponent', () => {
  let component: FormDeliveryOfWagonComponent;
  let fixture: ComponentFixture<FormDeliveryOfWagonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDeliveryOfWagonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDeliveryOfWagonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
