package model

import org.squeryl.KeyedEntity

import scala.collection.mutable.Set
import org.squeryl.annotations.Column
import org.squeryl.PrimitiveTypeMode._
import org.json4s.JsonAST._
import org.json4s.JsonDSL._
import org.json4s.jackson.JsonMethods._


/** The representation of Vehicle entity */
case class Vehicle private (
                             var id: Long,
                             var vtype: String,
                             var model: String,
                             var sn: String,
                             var state: Int) extends KeyedEntity[Long] {

  override def hashCode(): Int = id.hashCode

  override def equals(that: Any): Boolean =
    that match {
      case that: Vehicle => this.id == that.id
      case _ => false
  }

  override def toString = {
    "Vehicle("+id+","+vtype+","+model+","+sn+","+state+")"
  }

  def toJson() = {
    ("id" -> id) ~
      ("vtype" -> vtype) ~
      ("model" -> model) ~
      ("sn" -> sn) ~
      ("state" -> state)
  }
}

object Vehicle {
  /**
    * Creates and returns a new Vehicle,
    * id is unique and generated automatically.
    * @param vtype
    * @param model
    * @param sn
    * @param state
    * @return
    */
  def create(vtype: String, model: String,
             sn: String, state: Int): Vehicle = {
    DbSchema.insert(
      new Vehicle(0, vtype, model, sn, state))
  }

  def update(v: Vehicle): Vehicle = {
    DbSchema.update(v)
  }

  def delete(id: Long): Unit = {
    DbSchema.deleteVehicle(id)
  }

  /**
    * Returns the list of the missions
    * @return the list of the missions
    */
  def getVehicles(ids: Option[Set[Long]]) = {
    DbSchema.getAllVehicles(ids)
  }
}
