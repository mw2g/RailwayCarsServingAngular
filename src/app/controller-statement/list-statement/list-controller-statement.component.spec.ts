import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListControllerStatementComponent } from './list-controller-statement.component';

describe('ListMemoComponent', () => {
  let component: ListControllerStatementComponent;
  let fixture: ComponentFixture<ListControllerStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListControllerStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListControllerStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
