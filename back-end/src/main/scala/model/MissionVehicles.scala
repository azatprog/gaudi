package model

import org.squeryl.KeyedEntity
import org.squeryl.dsl.CompositeKey2

import scala.collection.mutable.ListBuffer

case class MissionVehicles private (
                                     missionId: Long,
                                     vehicleId: Long)
          extends KeyedEntity[CompositeKey2[Long,Long]] {

  def id = CompositeKey2(missionId, vehicleId)
}

object MissionVehicles {

  def apply(mid: Long, vids: Array[Long]
           ): List[MissionVehicles] = {
    var listBuffer = ListBuffer[MissionVehicles]()
    vids.foreach(vid => listBuffer += MissionVehicles(mid, vid))
    listBuffer.toList
  }
}