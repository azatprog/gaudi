import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { UniversalService } from "../../../services/universal.service";
import { Mission } from "../../../models/mission.model";
import {
  PrognosisService,
  VehicleFailureProbability
} from "../../../services/prognosis.service";
import { render } from "openlayers";
import { RouteSegment } from "../../../models/routeSegment.model";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-mission-report",
  templateUrl: "./mission-report.component.html",
  styleUrls: ["./mission-report.component.css"]
})
export class MissionReportComponent implements OnInit {
  mission: Mission;

  constructor(
    private uniService: UniversalService,
    private prognosService: PrognosisService,
    private ref: ChangeDetectorRef,
    private route: Router,
    private titleService: Title,
  ) {
    this.mission = uniService.selectedMission;
    titleService.setTitle(this.mission.name);
    this.mission.route.distance = Math.round(
      this.mission.route.distance / 1000
    );

    const nnsCopy = [...this.mission.route.noneNormalSegments];
    if (nnsCopy.length > 0) {
      if (nnsCopy[0].start != 0) {
        this.mission.route.noneNormalSegments = [
          (() => {
            let sg = new RouteSegment();
            sg.start = 0;
            sg.distance = nnsCopy[0].start;
            sg.condition = "NORMAL";
            return sg;
          })(),
          ...this.mission.route.noneNormalSegments
        ];
      }
      for (let i = 1; i < nnsCopy.length - 1; i++) {
        const prev = nnsCopy[i - 1].start + nnsCopy[i - 1].distance;
        if (prev < nnsCopy[i].start) {
          this.mission.route.noneNormalSegments = [
            ...this.mission.route.noneNormalSegments,
            (() => {
              let sg = new RouteSegment();
              sg.start = prev;
              sg.distance = nnsCopy[i].start - prev;
              sg.condition = "NORMAL";
              return sg;
            })()
          ];
        }
      }
      const last =
        nnsCopy[nnsCopy.length - 1].start +
        nnsCopy[nnsCopy.length - 1].distance;
      if (last < this.mission.route.distance) {
        this.mission.route.noneNormalSegments = [
          ...this.mission.route.noneNormalSegments,
          (() => {
            let sg = new RouteSegment();
            sg.start = last;
            sg.distance = this.mission.route.distance - last;
            sg.condition = "NORMAL";
            return sg;
          })()
        ];
      }
    } else {
      this.mission.route.noneNormalSegments = [
        (() => {
          let sg = new RouteSegment();
          sg.start = 0;
          sg.distance = this.mission.route.distance;
          sg.condition = "NORMAL";
          return sg;
        })()
      ];
    }

    this.mission.route.noneNormalSegments = this.mission.route.noneNormalSegments.sort(
      (sg1, sg2) => sg1.start - sg2.start
    );

    this.mission.vehicles.forEach((v, inx) => {
      prognosService
        .getFailureProbabilities(v, this.mission.route)
        .then((res: VehicleFailureProbability) => {
          this.mission.vehicles[inx]["subassy"] = res;
          this.mission.vehicles[inx]["prob"] =
            Math.round(
              (1 - res.probBrake / 100) *
                (1 - res.probEngine / 100) *
                (1 - res.probGear / 100) *
                100 *
                100
            ) / 100;
          ref.detectChanges();
        });
    });
  }

  printReport() {
    window.print();
  }

  ngOnInit() {
    window.onafterprint = () => {
      this.route.navigate(['/app/main/mission']);
    }
  }

  identify = (inx, item) => inx;
}
