import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMemoOfDeliveryComponent } from './list-memo-of-delivery.component';

describe('ListMemoComponent', () => {
  let component: ListMemoOfDeliveryComponent;
  let fixture: ComponentFixture<ListMemoOfDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMemoOfDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMemoOfDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
