import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../../../models/vehicle.model';
import { UniversalService } from '../../../services/universal.service';

@Component({
  moduleId: module.id,
  selector: 'popup-vehicles',
  templateUrl: './popup-vehicles.component.html',
  styleUrls: ['./popup-vehicles.component.css']
})
export class PopupVehiclesComponent implements OnInit {

  public vehicles: Array<Vehicle>;

	@Input() popupName: string;

	@Output() eventGetSelectedVehicle = new EventEmitter();
	@Output() eventClosePopup = new EventEmitter();
	@Output() eventOnSelectRootVehicle = new EventEmitter();

	constructor(public vehicleService: UniversalService ) {
    this.vehicleService.getVehicles().then((res) => this.vehicles = res);
	}

	ngOnInit(){
	}

	closeVehiclePopup() {
		this.eventClosePopup.emit();
	}

  selectVehicle(vehicle: Vehicle) {
    this.eventGetSelectedVehicle.emit(vehicle);
  }
}
