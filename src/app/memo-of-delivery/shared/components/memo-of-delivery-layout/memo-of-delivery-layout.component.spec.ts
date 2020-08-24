import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoOfDeliveryLayoutComponent } from './memo-of-delivery-layout.component';

describe('AdminLayoutComponent', () => {
  let component: MemoOfDeliveryLayoutComponent;
  let fixture: ComponentFixture<MemoOfDeliveryLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoOfDeliveryLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoOfDeliveryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
