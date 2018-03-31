package model

import java.util.{Calendar, Date}

import org.squeryl.KeyedEntity

import scala.collection.mutable.Set
import org.squeryl.annotations.Column
import org.squeryl.PrimitiveTypeMode._

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
             startDate: String, vehicle: Set[Vehicle], route: RouteDetails): Mission = {
    val mission = DbSchema.insert(
      new Mission(0, name, startDate, vehicle, route)
    )
    mission
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
  def getMissions(ids: Option[Set[Long]]): Set[Mission] = {
    val misVehicles: Set[MissionVehicles] = DbSchema.getAllMissionVehicles()
    var mvs = Set[MissionVehicles]()

    val missions = DbSchema.getAllMissions(ids)

    missions.foreach(
      m => {
        mvs = misVehicles.filter(_.missionId == m.id)
        var vids = Set[Long]()
        mvs.foreach(mv => vids += mv.vehicleId)
        m.vehicles = DbSchema.getAllVehicles(Some(vids))
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
    DbSchema.insert(list)
  }

  /**
    * Adds the vehicles to the mission.
    * @param mid  mission's id
    * @param vs the array of vehicles
    */
  def addVehicles(mid: Long, vs: Array[Vehicle]): Unit = {
    val list = MissionVehicles(mid, vs) // TODO: check that data is actual to id?
    DbSchema.insert(list)
  }

  def removeVehicles(mid: Long, vids: Array[Long]): Unit = {
    val list = MissionVehicles(mid, vids)
    list.foreach(mv => DbSchema.deleteMissionVehicles(mv))
  }
}
