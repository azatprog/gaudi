package controllers

import com.fasterxml.jackson.databind.ObjectMapper
import org.scalatra._
import model.{Mission, RouteDetails, Vehicle}
import org.json4s.DefaultFormats
import org.scalatra.json.JacksonJsonSupport
import org.json4s.jackson.Serialization.write

import scala.collection.mutable


class MissionController extends ScalatraServlet with JacksonJsonSupport with CorsSupport  {
  implicit val jsonFormats = DefaultFormats

  before() {
    contentType = formats("json")
  }

  get("/") {
    Mission.getMissions(None)
  }

  post("/") {
    val name = (parsedBody \ "name").extract[String]
    val startDate = (parsedBody \ "startDate").extract[String] // TODO: yyyy-mm-dd
    val vehicles = (parsedBody \ "vehicles").extract[mutable.Set[Vehicle]]
    val routeDetails = parsedBody \ "route_details"

    val rdStart = (routeDetails \ "start").extract[String]
    val rdEnd = (routeDetails \ "end").extract[String]
    val rdPoints = compact(render(routeDetails \ "points"))
    val rdNNS = compact(render(routeDetails \ "noneNormalSegments"))

    val route = RouteDetails.create(rdStart, rdEnd, rdPoints, rdNNS)

    val m = Mission.create(name, startDate, vehicles, route)

    m
  }

  put("/") {
    val jValue = parse(request.body)
    val mission = jValue.extract[Mission]
    Mission.update(mission)
  }

  delete("/:id") {
    val id = params("id").toLong
    Mission.delete(id)
  }

  post("/addvehicles") {
    contentType = formats("json")
    val mid = (parsedBody \ "mid").extract[Long]
    val vids = (parsedBody \ "vids").extract[Array[Long]]

    Mission.addVehicles(mid, vids)
  }
}
