import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UniversalService } from '../../../services/universal.service';
import { Mission } from '../../../models/mission.model';
import { PrognosisService, VehicleFailureProbability } from '../../../services/prognosis.service';
import { render } from 'openlayers';

@Component({
  selector: 'app-mission-report',
  templateUrl: './mission-report.component.html',
  styleUrls: ['./mission-report.component.css']
})
export class MissionReportComponent implements OnInit {

  mission: Mission;

  constructor(private uniService: UniversalService, 
              private prognosService: PrognosisService,
              private ref: ChangeDetectorRef,) {
    this.mission = uniService.selectedMission;

    this.mission.vehicles.forEach( (v, inx) => {
      prognosService.getFailureProbabilities(v, this.mission.route).then( (res: VehicleFailureProbability) => {
        this.mission.vehicles[inx]['prob'] = res;
        ref.detectChanges();
      });
    });
  }

  ngOnInit() {
    console.log(this.mission);
    // window.print();
  }

  identify = (inx, item) => inx;

}
