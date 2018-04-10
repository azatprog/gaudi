package model

import org.squeryl.KeyedEntity

import scala.collection.mutable

case class VehicleStatus private (
                           var id: Long,
                           var vehicleId: Long,
                           var missionId: Long,
                           var lng: BigDecimal,
                           var lat: BigDecimal,
                           var speed: BigDecimal,
                           var missionMileage: BigDecimal,
                           var timeFromMissionStart: Long,
                           var rpm: Int,
                           var engineTemperature: Double,
                           var outsideTemperature: Double,
                           var oilPressure: Double,
                           var coolingFluidLevel: Boolean,
                           var throttle: Int,
                           var gear: String,
                           var pushBrakePedal: Int,
                           var brakeTemperature: Double,
                           var mass: Int,
                           var cumulBrakePedalPushingWeight: Int,
                           var cumulBrakeHighTempOperation: Int,
                           var cumulDescentMileage: Double,
                           var cumulEngineOperation: Int,
                           var cumulEngineHighLoadOperation: Int,
                           var cumulEngineHighTempOperation: Int,
                           var cumulGearOperation: Int,
                           var cumulGearHighLoadOperation: Int,
                           var engineFault: Boolean,
                           var gearFault: Boolean,
                           var brakeFault: Boolean) extends KeyedEntity[Long] {

}

object VehicleStatus {
  def create(id: Long,
            vehicleId: Long,
            missionId: Long,
            lng: BigDecimal,
            lat: BigDecimal,
            speed: BigDecimal,
             missionMileage: BigDecimal,
            timeFromMissionStart: Long,
            rpm: Int,
            engineTemperature: Double,
            outsideTemperature: Double,
            oilPressure: Double,
            coolingFluidLevel: Boolean,
            throttle: Int,
            gear: String,
            pushBrakePedal: Int,
            brakeTemperature: Double,
            mass: Int,
            cumulBrakePedalPushingWeight: Int,
            cumulBrakeHighTempOperation: Int,
            cumulDescentMileage: Double,
            cumulEngineOperation: Int,
            cumulEngineHighLoadOperation: Int,
            cumulEngineHighTempOperation: Int,
            cumulGearOperation: Int,
            cumulGearHighLoadOperation: Int,
            engineFault: Boolean,
            gearFault: Boolean,
            brakeFault: Boolean): VehicleStatus = {

    val vs = new VehicleStatus(0, vehicleId, missionId, lng, lat,
      speed, missionMileage, timeFromMissionStart, rpm, engineTemperature, outsideTemperature,
      oilPressure, coolingFluidLevel, throttle, gear, pushBrakePedal, brakeTemperature, mass,
      cumulBrakePedalPushingWeight, cumulBrakeHighTempOperation, cumulDescentMileage, cumulEngineOperation,
      cumulEngineHighLoadOperation, cumulEngineHighTempOperation, cumulGearOperation, cumulGearHighLoadOperation,
      engineFault, gearFault, brakeFault)
    DbSchema.insert(vs)
  }

  def getVehicleStatuses(missionId: Long, vehicleId: Long, timeFromStart: Long) = {
    DbSchema.getAllVehicleStatuses(missionId, vehicleId, timeFromStart)
  }

  def getLatestVehicleStatus(vehicleId: Long) = {
    DbSchema.getLatestVehicleStatus(vehicleId: Long)
  }
}
