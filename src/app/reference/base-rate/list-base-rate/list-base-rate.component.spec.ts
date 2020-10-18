import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBaseRateComponent } from './list-base-rate.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListBaseRateComponent;
  let fixture: ComponentFixture<ListBaseRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBaseRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBaseRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
