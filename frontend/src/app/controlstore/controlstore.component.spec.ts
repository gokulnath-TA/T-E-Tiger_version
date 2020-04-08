import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlStoreComponent } from './controlstore.component';
describe('ControlStoreComponent', () => {
  let component: ControlStoreComponent;
  let fixture: ComponentFixture<ControlStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlStoreComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
