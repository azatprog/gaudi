package model

import org.json4s.JsonAST._
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._
import org.squeryl.KeyedEntity

import scala.collection.mutable
import scala.collection.mutable.MutableList

/** The representation of Mission entity */
case class Mission private(
                            var id: Long,
                            var name: String,
                            var startDate: String,
                            var vehicles: MutableList[Vehicle],
                            var route: RouteDetails) extends KeyedEntity[Long] {

  override def hashCode(): Int = id.hashCode

  override def equals(that: Any): Boolean =
    that match {
      case that: Mission => this.id == that.id
      case _ => false
    }

  override def toString = {
    "Mission(" + id + "," + name + "," + startDate + "," + vehicles + "," + route + ")"
  }

  def toJson() = {
    val rd = if (route != null) {
      route.toJson()
    } else null

    var vehs = MutableList[JValue]()
    vehicles.foreach(v => vehs += v.toJson())

    val isExecuted = DbSchema.hasMissionAnyVehicleStatuses(id)

    ("id" -> id) ~
      ("name" -> name) ~
      ("startDate" -> startDate) ~
      ("isExecuted" -> isExecuted) ~
      ("vehicles" -> vehs) ~
      ("route" -> rd)
  }
}

object Mission {
  /**
    * Creates and returns a new Mission,
    * id is unique and generated automatically.
    */
  def create(name: String,
             startDate: String, vehicles: MutableList[Vehicle],
             routeDetails: RouteDetails): Mission = {
    val mission = DbSchema.insert(
      new Mission(0, name, startDate, vehicles, routeDetails)
    )
    addVehicles(mission.id, vehicles)
    addRoute(mission.id, routeDetails)
    mission
  }

  def define(id: Long, name: String,
             startDate: String, vehicles: MutableList[Vehicle],
             routeDetails: RouteDetails): Mission = {
    new Mission(id, name, startDate, vehicles, routeDetails)
  }

  def update(m: Mission): Mission = {
    val mission = DbSchema.update(m)
    addVehicles(m.id, m.vehicles)
    mission
  }

  def delete(id: Long): Unit = {
    DbSchema.deleteMission(id)
  }

  /**
    * Returns the list of the missions.
    *
    * @return the list of the missions
    */
  def getMissions(ids: Option[mutable.Set[Long]]): MutableList[Mission] = {
    // TODO: should be substituted with getAllMissionVehicles(missionId)
    val misVehicles: MutableList[MissionVehicles] = DbSchema.getAllMissionVehicles()
    // TODO: should be substituted with getAllMissionVehicles(missionId)
    val misRoutes: MutableList[MissionRoutes] = DbSchema.getAllMissionRoutes()
    var mvs = MutableList[MissionVehicles]()

    val missions = DbSchema.getAllMissions(ids)

    missions.foreach(
      m => {
        // Getting the assigned vehicles
        mvs = misVehicles.filter(_.missionId == m.id)
        if (!mvs.isEmpty) {
          var vids = mutable.Set[Long]()
          mvs.foreach(mv => vids += mv.vehicleId)
          m.vehicles = DbSchema.getAllVehicles(Some(vids))
        } else m.vehicles = MutableList[Vehicle]()
        // Getting the assigned route
        val mrds = misRoutes.filter(_.missionId == m.id)
        if (!mrds.isEmpty) {
          val mrd = mrds.head
          m.route = DbSchema.getAllRouteDetails(
            Some(mutable.Set[Long](mrd.routeId))).head
        }
      })
    missions
  }

  /**
    * Adds the vehicles to the mission.
    *
    * @param mid  mission's id
    * @param vids the array of vehicles' ids
    */
  def addVehicles(mid: Long, vids: Array[Long]): Unit = {
    val list = MissionVehicles(mid, vids)
    DbSchema.insertVehicles(list)
  }

  /**
    * Adds the vehicles to the mission.
    *
    * @param mid mission's id
    * @param vs  the array of vehicles
    */
  def addVehicles(mid: Long, vs: MutableList[Vehicle]): Unit = {
    val list = MissionVehicles(mid, vs) // TODO: check that data is actual to id?
    DbSchema.insertVehicles(list)
  }

  def addRoute(mid: Long, routes: RouteDetails): Unit = {
    val list = MissionRoutes(mid, routes)
    DbSchema.insertRoutes(list)
  }

  def deleteRoute(mission: Mission) = {
    val mrs = MissionRoutes(mission.id, mission.route)
    DbSchema.deleteMissionRoutes(mrs)
  }

  def clearVehicleStatuses(mId: Long): Unit = {
    DbSchema.clearMissionVehicleStatuses(mId)
  }
}
