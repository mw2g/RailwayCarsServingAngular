import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCargoOperationComponent } from './list-cargo-operation.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListCargoOperationComponent;
  let fixture: ComponentFixture<ListCargoOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCargoOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCargoOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
