import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusroutesComponent } from './busroutes.component';

describe('BusroutesComponent', () => {
  let component: BusroutesComponent;
  let fixture: ComponentFixture<BusroutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusroutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusroutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
