import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryOfWagonLayoutComponent } from './delivery-of-wagon-layout.component';

describe('AdminLayoutComponent', () => {
  let component: DeliveryOfWagonLayoutComponent;
  let fixture: ComponentFixture<DeliveryOfWagonLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryOfWagonLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryOfWagonLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
