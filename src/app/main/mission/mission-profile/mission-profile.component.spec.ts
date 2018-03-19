import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionProfileComponent } from './mission-profile.component';

describe('MissionProfileComponent', () => {
  let component: MissionProfileComponent;
  let fixture: ComponentFixture<MissionProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
