import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lesson2 } from './lesson2';

describe('Lesson2', () => {
  let component: Lesson2;
  let fixture: ComponentFixture<Lesson2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lesson2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lesson2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
