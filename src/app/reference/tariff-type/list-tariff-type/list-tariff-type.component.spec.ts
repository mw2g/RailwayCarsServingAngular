import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTariffTypeComponent } from './list-tariff-type.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListTariffTypeComponent;
  let fixture: ComponentFixture<ListTariffTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTariffTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTariffTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
