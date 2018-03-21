import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupVehiclesComponent } from './popup-vehicles.component';

describe('PopupVehiclesComponent', () => {
  let component: PopupVehiclesComponent;
  let fixture: ComponentFixture<PopupVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
