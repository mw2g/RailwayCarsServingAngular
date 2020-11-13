import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTimeNormTypeComponent } from './list-time-norm-type.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListTimeNormTypeComponent;
  let fixture: ComponentFixture<ListTimeNormTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTimeNormTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTimeNormTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
