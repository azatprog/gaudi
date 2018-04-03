package model

import com.fasterxml.jackson.databind.annotation.{JsonDeserialize, JsonSerialize}
import org.squeryl.KeyedEntity
import org.json4s.{CustomSerializer, DefaultFormats}
import org.json4s.JsonAST._
import org.json4s.JsonDSL._
import com.fasterxml.jackson.core.{JsonGenerator, JsonParser, JsonProcessingException}
import com.fasterxml.jackson.databind.{DeserializationContext, JsonDeserializer, JsonSerializer, SerializerProvider}
import java.io.IOException

case class RouteDetails private (
                           var id: Long,
                           var start: String,
                           var end: String,
                           var distance: Double,
                           var points: String,
                           var noneNormalSegments: String) extends KeyedEntity[Long] {

  override def hashCode(): Int = id.hashCode

  override def equals(that: Any): Boolean =
    that match {
      case that: Mission => this.id == that.id
      case _ => false
    }
}


/*class RouteDetailSerializer extends JsonSerializer[RouteDetails] {
  override def serialize(value: RouteDetails, gen: JsonGenerator, serializers: SerializerProvider): Unit = {
    ("name" -> value.start) ~
      ("points" -> value.points)
  }
}*/


object RouteDetails {
  def create(start: String,
             end: String, distance: Double, points: String,
             noneNormalSegmants: String): RouteDetails = {

    DbSchema.insert(new RouteDetails(0, start, end, distance, points, noneNormalSegmants))
  }
}
