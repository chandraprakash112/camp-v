import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynemicForm } from './dynemic-form';

describe('DynemicForm', () => {
  let component: DynemicForm;
  let fixture: ComponentFixture<DynemicForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynemicForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynemicForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
