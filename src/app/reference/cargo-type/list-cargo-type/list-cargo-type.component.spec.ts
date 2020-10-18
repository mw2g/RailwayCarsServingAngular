import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCargoTypeComponent } from './list-cargo-type.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListCargoTypeComponent;
  let fixture: ComponentFixture<ListCargoTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCargoTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCargoTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
