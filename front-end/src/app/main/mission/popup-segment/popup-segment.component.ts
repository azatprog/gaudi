import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../../../models/vehicle.model';
import { UniversalService } from '../../../services/universal.service';
import { RouteSegment } from '../../../models/routeSegment.model';

@Component({
  moduleId: module.id,
  selector: 'popup-segments',
  templateUrl: './popup-segment.component.html',
  styleUrls: ['./popup-segment.component.css']
})
export class PopupSegmentComponent implements OnInit {

  public vehicles: Array<Vehicle>;

  @Input() popupName: string;
  @Input() theSegment: RouteSegment;

  @Output() eventSaveSegment = new EventEmitter();
	@Output() eventClosePopup = new EventEmitter();
  segmentConditions = ['NORMAL', 'MOUNTAINS', 'SWAMP', 'WET_FIELD', 'DRY_FIELD', 'GROUND_ROAD',  'HIGH_WAY', 'DESERT'];

	constructor() {
	}

  ngOnInit() {
    this.theSegment = new RouteSegment();
    console.log(this.theSegment);
  }

	closeVehiclePopup() {
		this.eventClosePopup.emit();
	}

  identify = (inx, item) => inx;

  saveSegment() {
    console.log(this.theSegment);
    this.eventSaveSegment.emit({...this.theSegment});
  }

}
