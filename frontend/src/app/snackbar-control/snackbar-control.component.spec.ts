import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarControlComponent } from './snackbar-control.component';

describe('SnackbarControlComponent', () => {
  let component: SnackbarControlComponent;
  let fixture: ComponentFixture<SnackbarControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
