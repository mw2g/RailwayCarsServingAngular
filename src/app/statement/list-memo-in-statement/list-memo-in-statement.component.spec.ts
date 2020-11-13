import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMemoInStatementComponent } from './list-memo-in-statement.component';

describe('DeliveryOfWagonComponent', () => {
  let component: ListMemoInStatementComponent;
  let fixture: ComponentFixture<ListMemoInStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMemoInStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMemoInStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
