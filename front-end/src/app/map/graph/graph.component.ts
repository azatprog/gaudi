import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  public getYDates(): Array<string> {
    return this.yDates.map(d => d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
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
  chart: Chart;
  data: ChartData;
  selectedParameter: string = "";
  parameters: string[];
  excludedParameters = ["mass", "id", "lng", "lat", "vehicleId", "timeFromMissionStart"];

  constructor(private vehicleService: VehicleStatusService) {
    this.data = new ChartData();
    this.parameters = Object.keys(new VehicleStatus());
    this.parameters = this.parameters.filter(el => {
      return !this.excludedParameters.includes(el);
    });
   }

  ngOnInit() {
    this.initialiazeChart();
    var timerId = setInterval(()=> {
      this.updateData();
    }, 1000);
  }

  onParameterChanged(event) {
    console.log(event);
    this.clearChart();
  }

  updateData() {
    console.log(this.selectedParameter);
    if (this.selectedParameter.length == 0)
      return;

      const lastDateString = this.data.getYDates()[this.data.getYDates().length - 1];
      var lastDate = new Date(lastDateString);
      console.log(lastDate);
      const timeStamp = Math.floor(lastDate.getTime() / 1000);
      console.log(timeStamp);
      this.vehicleService.getVehicleStatus(timeStamp).then(res => {
      this.chart.data.datasets[0].data.push(res.map(ds => {
        return ds[this.selectedParameter]}));
      this.chart.data.labels.push(res.map(ds => {
        const d = new Date();
        return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();//ds.timeFromMissionStart
      }));
      this.chart.update();
    });
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
