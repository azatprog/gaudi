import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Vehicle } from '../../../models/vehicle.model';
import { PlatformLocation, Location } from '@angular/common';
import { UniversalService } from '../../../services/universal.service';
import { Mission } from '../../../models/mission.model';
import { SelectControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-vehicle-profile',
  templateUrl: './vehicle-profile.component.html',
  styleUrls: ['./vehicle-profile.component.css']
})
export class VehicleProfileComponent implements OnInit {

  @ViewChild('f') form: any;
  @ViewChild('vehicleType') vehicleType: ElementRef;

  private vehicle: Vehicle;
  constructor(
              private location: PlatformLocation,
              private _location: Location,
              private vehicleService: UniversalService,
              private renderer: Renderer
  ) { 
      if (this.vehicleService.selectedVehicle) {
        this.vehicle = Object.assign({}, this.vehicleService.selectedVehicle);
      } else {      
        this.vehicle = new Vehicle();
      }
      
      location.onPopState(() => {
        this.vehicleService.selectedVehicle = null;
        this.vehicleService.isVehicleReadOnly = true;
      });
  }

  ngOnInit() {
    if (this.vehicleService.isVehicleReadOnly == false){
      this.renderer.invokeElementMethod(this.vehicleType.nativeElement, 'focus');
    }
  }

  compareFn(c1: Mission, c2: Mission): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  goToVehicleList() {
    this._location.back();
    this.vehicleService.selectedVehicle = null;
    this.vehicleService.isVehicleReadOnly = true;
  }

  goToVehicleShow() {
    this.vehicleService.isVehicleReadOnly = true;
  }

  cancel() {  
    if (this.vehicleService.selectedVehicle === null) {
      this.goToVehicleList();
    } else {
      this.vehicle = this.vehicleService.selectedVehicle;
      this.goToVehicleShow();      
    }
  }

  editVehicle() {
    this.vehicleService.isVehicleReadOnly = false;
    this.renderer.invokeElementMethod(this.vehicleType.nativeElement, 'focus');
  }

  delVehicle() {
    this.vehicleService.deleteVehicle(this.vehicleService.selectedVehicle).then(res => {
      alert('deleted');
      this.goToVehicleList();
    }).catch(err=> {
        if (err.status == 0) {
            alert('Not bound to server! Check your connection!');
        } else {
            alert(err);
        }
    });   
  }  

  save() {
    if (this.vehicle.id == null) {
      this.vehicleService.addVehicle(this.vehicle).then(res => {
        this.vehicle = new Vehicle();
        this.form.reset();
        this.goToVehicleList();
      }).catch(err=> {
        if (err.status == 0) {
            alert('Not bound to server! Check your connection!');
          } else {
            alert(err);
          }
      });
    } else {
        this.vehicleService.updateVehicle(this.vehicle).then(updated => {
            this.vehicle = updated;
            alert('updated');
            this.vehicleService.selectedVehicle = null;
            this.goToVehicleList();
        }).catch(err=> {
            this.vehicleService.selectedVehicle = null;
            this.vehicleService.isVehicleReadOnly = true;
            if (err.status == 0) {
                alert('Not bound to server! Check your connection!');
            } else {
                alert(err);
            }
        });
    }
  }
}
