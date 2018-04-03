package controllers

import org.scalatra._
import model.{Mission, RouteDetails, Vehicle}
import org.json4s.{DefaultFormats}
import org.json4s.JsonAST.JValue
import org.scalatra.json.JacksonJsonSupport

import scala.collection.mutable

class MissionController extends ScalatraServlet with JacksonJsonSupport with CorsSupport  {
  implicit val jsonFormats = DefaultFormats

  options("/*"){
    println("in options..")
    println(request.getHeader("Access-Control-Request-Headers"))
    response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"))
  }

  before() {
    contentType = formats("json")
  }

  get("/") {
    val missions = Mission.getMissions(None)
    var result = mutable.Set[JValue]()
    missions.foreach(m =>
      result += m.toJson()
    )
    result
  }

  post("/") {
    val name = (parsedBody \ "name").extract[String]
    val startDate = (parsedBody \ "startDate").extract[String] // TODO: yyyy-mm-dd
    // TODO: change?: not only vehicles' ids are counted, other data should be correct
    val vehicles = (parsedBody \ "vehicles").extract[mutable.Set[Vehicle]]
    val routeDetails = parsedBody \ "route"

    val rdStart = (routeDetails \ "start").extract[String]
    val rdEnd = (routeDetails \ "end").extract[String]
    val rdDistance = (routeDetails \ "distance").extract[Double]
    val rdPoints = compact(render(routeDetails \ "points"))
    val rdNNS = compact(render(routeDetails \ "noneNormalSegments"))

    // TODO: What about the reusage of the existing route?
    val route = RouteDetails.create(rdStart, rdEnd, rdDistance, rdPoints, rdNNS)
    val m = Mission.create(name, startDate, vehicles, route)
    val mis = Mission.getMissions(Some(mutable.Set[Long](m.id))).head
    mis.toJson()
  }


  // TODO: update routedetails as well? Now it adds a new one each time!!! FIX later!
  // TODO: if the mission does not exist the new one will be created without route and vehicles
  put("/") {
    /*val jValue = parse(request.body)
    val mission = jValue.extract[Mission]*/

    val id = (parsedBody \ "id").extract[Long]
    val name = (parsedBody \ "name").extract[String]
    val startDate = (parsedBody \ "startDate").extract[String] // TODO: yyyy-mm-dd
    // TODO: Update the vehicles, they are ignored here for now
    val vehicles = (parsedBody \ "vehicles").extract[mutable.Set[Vehicle]]
    val routeDetails = parsedBody \ "route"

    val rdStart = (routeDetails \ "start").extract[String]
    val rdEnd = (routeDetails \ "end").extract[String]
    val rdDistance = (routeDetails \ "distance").extract[Double]
    val rdPoints = compact(render(routeDetails \ "points"))
    val rdNNS = compact(render(routeDetails \ "noneNormalSegments"))

    // TODO: Update the route, it is ignored here for now
    val route = RouteDetails.create(rdStart, rdEnd, rdDistance, rdPoints, rdNNS)
    val mission = Mission.define(id, name, startDate, vehicles, route)
    Mission.update(mission)
    Mission.getMissions(Some(mutable.Set[Long](mission.id)))
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
