import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPenaltyComponent } from './list-penalty.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListPenaltyComponent;
  let fixture: ComponentFixture<ListPenaltyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPenaltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
