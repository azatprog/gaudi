import { Injectable } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { RouteSegment } from '../models/routeSegment.model';
import { LatestVehicleStatus } from '../models/latestVehicleStatus.model';
import { RouteDetails } from '../models/routedetails.model';
import { VehicleStatusService } from './vehicle-status.service';

export class VehicleFailureProbability {
  
  probBrake: number;
  probEngine: number;
  probGear: number;

  constructor(probBrake: number, probEngine: number, probGear: number) {
    this.probBrake = probBrake;
    this.probEngine = probEngine;
    this.probGear = probGear;
  }
}

@Injectable()
export class PrognosisService {

coefcient =
  {
    'NORMAL':
    {
      'cumulBrakePedalPushingWeight': 196.41,
      'cumulBrakeHighTempOperation': 0.44,
      'cumulDescentMileage': 0.01605,

      'cumulEngineOperation': 64.1,
      'cumulEngineHighLoadOperation': 10.85,
      'cumulEngineHighTempOperation': 0.02,

      'cumulGearOperation': 57.07,
      'cumulGearHighLoadOperation': 24.66
    },
    'MOUNTAINS':
    {
      'cumulBrakePedalPushingWeight': 300.435,
      'cumulBrakeHighTempOperation': 0.2,
      'cumulDescentMileage': 0.0,

      'cumulEngineOperation': 0.0,
      'cumulEngineHighLoadOperation': 0.0,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': 57.07,
      'cumulGearHighLoadOperation': 24.66
    },
    'SWAMP':
    {
      'cumulBrakePedalPushingWeight': 0.0,
      'cumulBrakeHighTempOperation': 0.0,
      'cumulDescentMileage': 0.0,

      'cumulEngineOperation': 192.3,
      'cumulEngineHighLoadOperation': 43.4,
      'cumulEngineHighTempOperation': 0.08,

      'cumulGearOperation': 57.07,
      'cumulGearHighLoadOperation': 24.66
    },
    'WET_FIELD':
    {
      'cumulBrakePedalPushingWeight': 451.743,
      'cumulBrakeHighTempOperation': 0.836,
      'cumulDescentMileage': 0.017655,
      'cumulEngineOperation': 121.79,
      'cumulEngineHighLoadOperation': 24.4125,
      'cumulEngineHighTempOperation': 0.04,
      'cumulGearOperation': 142.675,
      'cumulGearHighLoadOperation': 49.32
    },
    'DRY_FIELD':
    {
      'cumulBrakePedalPushingWeight': 432.102,
      'cumulBrakeHighTempOperation': 0.748,
      'cumulDescentMileage': 0.017655,
      'cumulEngineOperation': 115.38,
      'cumulEngineHighLoadOperation': 21.7,
      'cumulEngineHighTempOperation': 0.034,
      'cumulGearOperation': 114.14,
      'cumulGearHighLoadOperation': 41.922
    },
    'GROUND_ROAD':
    {
      'cumulBrakePedalPushingWeight': 530.307,
      'cumulBrakeHighTempOperation': 1.056,
      'cumulDescentMileage': 0.030495,
      'cumulEngineOperation': 96.15,
      'cumulEngineHighLoadOperation': 15.19,
      'cumulEngineHighTempOperation': 0.038,
      'cumulGearOperation': 85.605,
      'cumulGearHighLoadOperation': 34.524
    },
    'HIGH_WAY':
    {
      'cumulBrakePedalPushingWeight': 0.0,
      'cumulBrakeHighTempOperation': 0.0,
      'cumulDescentMileage': 0.0,
      'cumulEngineOperation': 0.0,
      'cumulEngineHighLoadOperation': 0.0,
      'cumulEngineHighTempOperation': 0.0,
      'cumulGearOperation': 0.0,
      'cumulGearHighLoadOperation': 0.0
    },
    'DESERT':
    {
      'cumulBrakePedalPushingWeight': 255.333,
      'cumulBrakeHighTempOperation': 0.528,
      'cumulDescentMileage': 0.017655,
      'cumulEngineOperation': 128.2,
      'cumulEngineHighLoadOperation': 24.955,
      'cumulEngineHighTempOperation': 0.066,
      'cumulGearOperation': 85.605,
      'cumulGearHighLoadOperation': 29.592
    }
};

getFailureProbabilities(vehicle: Vehicle, route: RouteDetails): Promise<VehicleFailureProbability> {
  return new Promise((resolve, reject) => {
    this.vehicleStatusService.getLatestVehicleStatus(vehicle.id)
      .then((latestVehicleStatus: LatestVehicleStatus) => {
            const routeDistance = Math.round(route.distance / 1000);
            const lengthByType = this.getLengthByType(route.noneNormalSegments);
              let brakeDamage = 0,
                  engineDamage = 0,
                  gearDamage = 0;
              let pedalPush = 0,
                  highTemp = 0,
                  decentMil = 0;
              let engOper = 0,
                  engTemp = 0,
                  engLoad = 0;
              let gearOper = 0,
                  gearLoad = 0;

              let totalSegmentDistance = 0;
              Object.keys(lengthByType).forEach(k => {
                pedalPush += this.calcCumul(lengthByType[k], k, 'cumulBrakePedalPushingWeight');
                highTemp += this.calcCumul(lengthByType[k], k, 'cumulBrakeHighTempOperation');
                decentMil += this.calcCumul(lengthByType[k], k, 'cumulDescentMileage');

                engOper += this.calcCumul(lengthByType[k], k, 'cumulEngineOperation');
                engTemp += this.calcCumul(lengthByType[k], k, 'cumulEngineHighTempOperation');
                engLoad += this.calcCumul(lengthByType[k], k, 'cumulEngineHighLoadOperation');

                gearOper += this.calcCumul(lengthByType[k], k, 'cumulGearOperation');
                gearLoad += this.calcCumul(lengthByType[k], k, 'cumulGearHighLoadOperation');

                totalSegmentDistance += lengthByType[k];
              });

              const delta = (routeDistance - totalSegmentDistance) < 0 ? 0 : (routeDistance - totalSegmentDistance);

              pedalPush +=  latestVehicleStatus.cumulBrakePedalPushingWeight +
                            this.calcCumul(delta, 'NORMAL', 'cumulBrakePedalPushingWeight');
              highTemp += latestVehicleStatus.cumulBrakeHighTempOperation +
                          this.calcCumul(delta, 'NORMAL', 'cumulBrakeHighTempOperation');
              decentMil += latestVehicleStatus.cumulDescentMileage +
                          this.calcCumul(delta, 'NORMAL', 'cumulDescentMileage');

              engOper += latestVehicleStatus.cumulEngineOperation +
                          this.calcCumul(delta, 'NORMAL', 'cumulEngineOperation');
              engTemp += latestVehicleStatus.cumulEngineHighTempOperation +
                          this.calcCumul(delta, 'NORMAL', 'cumulEngineHighTempOperation');
              engLoad += latestVehicleStatus.cumulEngineHighLoadOperation +
                          this.calcCumul(delta, 'NORMAL', 'cumulEngineHighLoadOperation');

              gearOper += latestVehicleStatus.cumulGearOperation +
                          this.calcCumul(delta, 'NORMAL', 'cumulGearOperation');
              gearLoad += latestVehicleStatus.cumulGearHighLoadOperation +
                          this.calcCumul(delta, 'NORMAL', 'cumulGearHighLoadOperation');

              brakeDamage = this.calcDamage(pedalPush, highTemp, decentMil, 400000, 144000);
              engineDamage = this.calcDamage(engOper, engTemp, engLoad, 100, 10);
              gearDamage = this.calcDamage(gearOper, gearLoad);

              console.log(brakeDamage, engineDamage, gearDamage);
              const probBrake = Math.round((1 / (1 + Math.exp(-0.0000007 * (brakeDamage - 7200000)))) * 100);
              const probEngine = Math.round((1 / (1 + Math.exp(-0.00003 * (engineDamage - 120000)))) * 100);
              const probGear = Math.round((1 / (1 + Math.exp(-0.00005 * (gearDamage - 90000)))) * 100);
              console.log(probBrake, probEngine, probGear);

              resolve(new VehicleFailureProbability(probBrake, probEngine, probGear));
            });
 });
}

calcCumul = (len: number, key: string, coef: string) => len * this.coefcient[key][coef];

calcDamage = ( cumul1: number, cumul2: number, cumul3: number = null, k1?: number, k2?: number) => {
  const v = (cumul3 !== null) ?
            ( cumul1 +
              k1 * cumul2 +
              k2 * cumul3 )
            : ( cumul1 +
              10 * cumul2 );
  return v;
}

getLengthByType = (segments: RouteSegment[]) => {
  const lengthByType = {};
  segments.forEach(s => {
    lengthByType[s.condition] = (lengthByType[s.condition] || 0) + s.distance;
  });
  return lengthByType;
}

  constructor(public vehicleStatusService: VehicleStatusService) { }

}
