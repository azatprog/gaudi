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
                           var missionMilage: BigDecimal,
                           var timeFromMissionStart: Long,
                           var rpm: Int,
                           var throttle: Int,
                           var gear: String,
                           var pushBrakePedal: Int) extends KeyedEntity[Long] {

}

object VehicleStatus {
  def create(id: Long,
             vehicleId: Long,
             missionId: Long,
             lng: BigDecimal,
             lat: BigDecimal,
             speed: BigDecimal,
             missionMilage: BigDecimal,
             timeFromMissionStart: Long,
             rpm: Int,
             throttle: Int,
             gear: String,
             pushBrakePedal: Int): VehicleStatus = {

    val vs = new VehicleStatus(0, vehicleId, missionId, lng, lat,
      speed, missionMilage, timeFromMissionStart, rpm, throttle, gear, pushBrakePedal)
    DbSchema.insert(vs)
  }

  def getVehicleStatuses(missionId: Long, vehicleId: Long, timeFromStart: Long) = {
    DbSchema.getAllVehicleStatuses(missionId, vehicleId, timeFromStart)
  }
}
