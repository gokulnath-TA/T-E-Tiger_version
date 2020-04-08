import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMeasureComponent } from './testmeasure.component';

describe('TestMeasureComponent', () => {
  let component: TestMeasureComponent;
  let fixture: ComponentFixture<TestMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestMeasureComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
