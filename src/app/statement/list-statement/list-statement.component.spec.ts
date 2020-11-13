import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStatementComponent } from './list-statement.component';

describe('ListMemoComponent', () => {
  let component: ListStatementComponent;
  let fixture: ComponentFixture<ListStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
