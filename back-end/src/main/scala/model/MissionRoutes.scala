package model

import org.squeryl.KeyedEntity
import org.squeryl.dsl.CompositeKey2

import scala.collection.mutable.ListBuffer

case class MissionRoutes private (
                                     missionId: Long,
                                     routeId: Long)
          extends KeyedEntity[CompositeKey2[Long,Long]] {

  def id = CompositeKey2(missionId, routeId)
}

object MissionRoutes {

  def apply(mid: Long, routeIds: Array[Long]
           ): List[MissionRoutes] = {
    var listBuffer = ListBuffer[MissionRoutes]()
    routeIds.foreach(vid => listBuffer += MissionRoutes(mid, vid))
    listBuffer.toList
  }

  def apply(mid: Long, route: RouteDetails
           ): List[MissionRoutes] = {
    List(MissionRoutes(mid, route.id))
  }
}