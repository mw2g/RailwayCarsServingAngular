import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMemoInControllerStatementComponent } from './list-memo-in-controller-statement.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListMemoInControllerStatementComponent;
  let fixture: ComponentFixture<ListMemoInControllerStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMemoInControllerStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMemoInControllerStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
