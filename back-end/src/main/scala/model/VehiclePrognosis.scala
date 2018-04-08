package model

import org.squeryl.KeyedEntity

import scala.collection.mutable

case class VehiclePrognosis private (
                              var id: Long,
                              var vehicleId: Long,
                              var missionId: Long,
                              var lng: BigDecimal,
                              var lat: BigDecimal,
                              var successChance: Int) extends KeyedEntity[Long] {

}

object VehiclePrognosis {
  def create(vehicleId: Long, missionId: Long,
             lng: BigDecimal, lat: BigDecimal,
             successChance: Int): VehiclePrognosis = {
    DbSchema.insert(
      new VehiclePrognosis(0, vehicleId, missionId, lng, lat, successChance))
  }

  def update(v: VehiclePrognosis): Unit = {
    DbSchema.update(v)
  }

  def delete(id: Long): Unit = {
    DbSchema.deleteVehiclePrognosis(id)
  }

  /**
    * Returns the list of the missions
    * @return the list of the missions
    */
  def getVehiclePrognosis(missionId: Long, vehicleId: Long) = {
    DbSchema.getAllVehiclePrognosis(missionId, vehicleId)
  }
}
