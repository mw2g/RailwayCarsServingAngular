import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTimeNormComponent } from './list-time-norm.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListTimeNormComponent;
  let fixture: ComponentFixture<ListTimeNormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTimeNormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTimeNormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
