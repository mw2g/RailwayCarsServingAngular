import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMemoOfDispatchComponent } from './list-memo-of-dispatch.component';

describe('ListMemoComponent', () => {
  let component: ListMemoOfDispatchComponent;
  let fixture: ComponentFixture<ListMemoOfDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMemoOfDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMemoOfDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
