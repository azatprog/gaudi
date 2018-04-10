import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSegmentComponent } from './popup-segment.component';

describe('PopupSegmentComponent', () => {
  let component: PopupSegmentComponent;
  let fixture: ComponentFixture<PopupSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupSegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
