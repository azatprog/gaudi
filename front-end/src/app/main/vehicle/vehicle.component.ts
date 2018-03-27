import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversalService } from '../../services/universal.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicles: Array<Object>;

  constructor(private route: Router, public vehicleService: UniversalService) { 
    this.vehicles = this.vehicleService.vehicles;
  }

  ngOnInit() {
    this.vehicles = this.vehicleService.vehicles;
    console.log(this.vehicles);
  }

  createVehicle() {
    this.vehicleService.selectedVehicle = null;
    this.vehicleService.isVehicleReadOnly = false;
    this.route.navigate(['/app/main/vehicleProfile']);
  }

  identify = (inx, item) => inx;

  edit(vehicle) {
    this.vehicleService.selectedVehicle = vehicle;
    this.vehicleService.isVehicleReadOnly = true;
    this.route.navigate(['/app/main/vehicleProfile']);
  }

}
