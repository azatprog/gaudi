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
      'cumulBrakePedalPushingWeight': 26.06,
      'cumulBrakeHighTempOperation': 0.59,
      'cumulDescentMileage': 0.0018,

      'cumulEngineOperation': 57.54,
      'cumulEngineHighLoadOperation': 1.37,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': 55.07,
      'cumulGearHighLoadOperation': 17.47
    },
    'MOUNTAINS':
    {
      'cumulBrakePedalPushingWeight': 1200.55,
      'cumulBrakeHighTempOperation': 0.0,
      'cumulDescentMileage': 0.13,

      'cumulEngineOperation': 79.67,
      'cumulEngineHighLoadOperation': 27.97,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': 51.86,
      'cumulGearHighLoadOperation': 10.48
    },
    'SWAMP':
    {
      'cumulBrakePedalPushingWeight': 0.0,
      'cumulBrakeHighTempOperation': 0.0,
      'cumulDescentMileage': 0.0,

      'cumulEngineOperation': 366.53,
      'cumulEngineHighLoadOperation': 366.52,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': 366.48,
      'cumulGearHighLoadOperation': 209.29
    },
    'HIGH_WAY':
    {
      'cumulBrakePedalPushingWeight': 2.92,
      'cumulBrakeHighTempOperation': 0.037,
      'cumulDescentMileage': 0.0,

      'cumulEngineOperation': 67.02,
      'cumulEngineHighLoadOperation': 64.3,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': 66.98,
      'cumulGearHighLoadOperation': 31.04
    }
};

intercept =
  {
    'NORMAL':
    {
      'cumulBrakePedalPushingWeight': 2735.5,
      'cumulBrakeHighTempOperation': 1.58,
      'cumulDescentMileage': -0.11,

      'cumulEngineOperation': -398.72,
      'cumulEngineHighLoadOperation': 316.11,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': -1035.76,
      'cumulGearHighLoadOperation': 883.77
    },
    'MOUNTAINS':
    {
      'cumulBrakePedalPushingWeight': -6441.71,
      'cumulBrakeHighTempOperation': 0.0,
      'cumulDescentMileage': 0.64,

      'cumulEngineOperation': -184.02,
      'cumulEngineHighLoadOperation': 181.6,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': 166.64,
      'cumulGearHighLoadOperation': 139.02
    },
    'SWAMP':
    {
      'cumulBrakePedalPushingWeight': 0.0,
      'cumulBrakeHighTempOperation': 0.0,
      'cumulDescentMileage': 0.0,

      'cumulEngineOperation': -7.18,
      'cumulEngineHighLoadOperation': -7.12,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': -27.52,
      'cumulGearHighLoadOperation': -102.33
    },
    'HIGH_WAY':
    {
      'cumulBrakePedalPushingWeight': -243.96,
      'cumulBrakeHighTempOperation': -4.75,
      'cumulDescentMileage': 0.0,

      'cumulEngineOperation': -20.42,
      'cumulEngineHighLoadOperation': -58.75,
      'cumulEngineHighTempOperation': 0.0,

      'cumulGearOperation': -21.51,
      'cumulGearHighLoadOperation': 116.78
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
              const probBrake = Math.round((1 / (1 + Math.exp(-3.7/720000000 * (brakeDamage - 720000000)))) * 100);
              const probEngine = Math.round((1 / (1 + Math.exp(-3.7/12000000 * (engineDamage - 12000000)))) * 100);
              const probGear = Math.round((1 / (1 + Math.exp(-3.7/9000000 * (gearDamage - 9000000)))) * 100);
              console.log(probBrake, probEngine, probGear);

              resolve(new VehicleFailureProbability(probBrake, probEngine, probGear));
            });
 });
}

calcCumul = (len: number, key: string, coef: string) => len * this.coefcient[key][coef] + this.intercept[key][coef];

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
