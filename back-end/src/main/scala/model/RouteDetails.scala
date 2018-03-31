package model

import org.squeryl.KeyedEntity
import org.json4s._

case class RouteDetails private (
                           var id: Long,
                           var start: String,
                           var end: String,
                           var points: String,
                           var noneNormalSegments: String) extends KeyedEntity[Long] {

  override def hashCode(): Int = id.hashCode

  override def equals(that: Any): Boolean =
    that match {
      case that: Mission => this.id == that.id
      case _ => false
    }
}

/*
class RouteDetailsSerializer extends Serializer[RouteDetails] {
  override def deserialize(implicit format: Formats): PartialFunction[(TypeInfo, JValue), RouteDetails] = {

  }

  override def serialize(implicit format: Formats): PartialFunction[Any, JValue] = {
    case x: RouteDetails =>
      import JsonDSL._
      ("id" -> x.id)
  }
}
*/

object RouteDetails {
  def create(start: String,
             end: String, points: String,
             noneNormalSegmants: String): RouteDetails = {

    DbSchema.insert(new RouteDetails(0, start, end, points, noneNormalSegmants))
  }
}
