import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { MapService } from '../../services/map.service';
import { VehicleStatus } from '../../models/vehicleStatus.model';
import { VehicleStatusService } from '../../services/vehicle-status.service';


export class ChartData {
  private xData: Array<number>;
  private yDates: Array<Date>;

  public push(data: number,  date: Date) {
    this.xData.push(data);
    this.yDates.push(date);
  }

  public getXData(): Array<number> {
    return this.xData;
  }

  public getYDates(): Array<Date> {
    return this.yDates;
    ;
  }

  public clear() {
    this.xData = new Array<number>();
    this.yDates = new Array<Date>();
  }

  constructor() {
    this.clear();
  }
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  @Input() set vehicleStatus(status: VehicleStatus[]) {
    // console.log("set:" + status);
    this.updateData(status);
  }

  timerId: any;
  chart: Chart;
  data: ChartData;
  selectedParameter: string = "";
  parameters: string[];
  startTime: Date;
  excludedParameters = ["mass", "id", "lng", "lat", "vehicleId", "timeFromMissionStart", "missionId"];

  constructor(private vehicleService: VehicleStatusService) {
    this.data = new ChartData();
    this.parameters = Object.keys(new VehicleStatus());
    this.parameters = this.parameters.filter(el => {
      return !this.excludedParameters.includes(el);
    });

    this.selectedParameter = "speed";
   }

  ngOnInit() {
     this.initialiazeChart();
     
  }

  ngOnDestroy() {
    if (this.timerId)
      clearInterval(this.timerId);
  }

  onParameterChanged(event) {
    this.clearChart();
  }

  updateData(status: VehicleStatus[]) {
      if (!this.chart)
        return;
        
      if(!this.startTime) {
        this.startTime = new Date();
        this.data.push(1, this.startTime);
      }

      let lastDate = null;
      if (this.data.getYDates().length > 0)
        lastDate = this.data.getYDates()[this.data.getYDates().length - 1];

      let res = status.sort((a, b) => this.compare(a.timeFromMissionStart, b.timeFromMissionStart));
      this.chart.data.datasets[0].data = res.map(ds => {
        return ds[this.selectedParameter]});

      this.chart.data.labels = res.map(ds => {
        const startTimeStamp = this.startTime.getTime();
        const d = new Date(startTimeStamp + ds.timeFromMissionStart * 1000);
        this.data.push(1, d);
        return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      });

      this.chart.update();
  }

  compare(a, b){
    let comparison = 0;
  
    if (a > b) {
      comparison = 1;
    } else if (b > a) {
      comparison = -1;
    }
  
    return comparison;
  }

  clearChart() {
    this.data.clear();
    this.chart.data.datasets[0].data = [];
    this.chart.data.labels = [];
    this.chart.update();
  }

  initialiazeChart() {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: new Array<Date>(),
        datasets: [
          {
            data: [],
            borderColor: '#3cba9f',
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        }
      }
    });
  }
}
