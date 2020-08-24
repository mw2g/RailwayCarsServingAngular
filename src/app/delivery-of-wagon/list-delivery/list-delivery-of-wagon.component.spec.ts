import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDeliveryOfWagonComponent } from './list-delivery-of-wagon.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListDeliveryOfWagonComponent;
  let fixture: ComponentFixture<ListDeliveryOfWagonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDeliveryOfWagonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDeliveryOfWagonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
