package model

import java.util.{Calendar, Date}

import org.squeryl.KeyedEntity

import scala.collection.mutable.Set
import org.squeryl.annotations.Column
import org.squeryl.PrimitiveTypeMode._

import scala.collection.mutable

/** The representation of Mission entity */
case class Mission private (
                             var id: Long,
                             var name: String,
                             var startDate: String,
                             var vehicles: Set[Vehicle],
                             var route: RouteDetails) extends KeyedEntity[Long] {

  override def hashCode(): Int = id.hashCode

  override def equals(that: Any): Boolean =
    that match {
      case that: Mission => this.id == that.id
      case _ => false
  }

  override def toString = {
    "Mission("+id+","+name+","+startDate+","+vehicles+","+route+")"
  }
}

object Mission {
  /**
    * Creates and returns a new Mission,
    * id is unique and generated automatically.
    */
  def create(name: String,
             startDate: String, vehicles: Set[Vehicle],
             routeDetails: RouteDetails): Mission = {
    val mission = DbSchema.insert(
      new Mission(0, name, startDate, vehicles, routeDetails)
    )
    addVehicles(mission.id, vehicles)
    addRoute(mission.id, routeDetails)
    mission
  }

  def define(id: Long, name: String,
             startDate: String, vehicles: Set[Vehicle],
             routeDetails: RouteDetails): Mission = {
    new Mission(id, name, startDate, vehicles, routeDetails)
  }

  def update(m: Mission): Mission = {
    DbSchema.update(m)
  }

  def delete(id: Long): Unit = {
    DbSchema.deleteMission(id)
  }

  /**
    * Returns the list of the missions.
    * @return the list of the missions
    */
  def getMissions(ids: Option[mutable.Set[Long]]): mutable.Set[Mission] = {
    // TODO: should be substituted with getAllMissionVehicles(missionId)
    val misVehicles: mutable.Set[MissionVehicles] = DbSchema.getAllMissionVehicles()
    // TODO: should be substituted with getAllMissionVehicles(missionId)
    val misRoutes: mutable.Set[MissionRoutes] = DbSchema.getAllMissionRoutes()
    var mvs = mutable.Set[MissionVehicles]()

    val missions = DbSchema.getAllMissions(ids)

    missions.foreach(
      m => {
        // Getting the assigned vehicles
        mvs = misVehicles.filter(_.missionId == m.id)
        var vids = mutable.Set[Long]()
        mvs.foreach(mv => vids += mv.vehicleId)
        m.vehicles = DbSchema.getAllVehicles(Some(vids))

        // Getting the assigned route
        val mrd = misRoutes.filter(_.missionId == m.id).head
        m.route = DbSchema.getAllRouteDetails(
          Some(mutable.Set[Long](mrd.routeId))).head
      })
    missions
  }

  /**
    * Adds the vehicles to the mission.
    * @param mid  mission's id
    * @param vids the array of vehicles' ids
    */
  def addVehicles(mid: Long, vids: Array[Long]): Unit = {
    val list = MissionVehicles(mid, vids)
    DbSchema.insertVehicles(list)
  }

  /**
    * Adds the vehicles to the mission.
    * @param mid  mission's id
    * @param vs the array of vehicles
    */
  def addVehicles(mid: Long, vs: Set[Vehicle]): Unit = {
    val list = MissionVehicles(mid, vs) // TODO: check that data is actual to id?
    DbSchema.insertVehicles(list)
  }

  def removeVehicles(mid: Long, vids: Array[Long]): Unit = {
    val list = MissionVehicles(mid, vids)
    list.foreach(mv => DbSchema.deleteMissionVehicles(mv))
  }

  def addRoute(mid: Long, routes: RouteDetails): Unit = {
    val list = MissionRoutes(mid, routes)
    DbSchema.insertRoutes(list)
  }
}
