import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionrouteComponent } from './missionroute.component';

describe('MissionrouteComponent', () => {
  let component: MissionrouteComponent;
  let fixture: ComponentFixture<MissionrouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionrouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionrouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
