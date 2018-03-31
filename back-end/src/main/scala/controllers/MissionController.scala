package controllers

import com.fasterxml.jackson.databind.ObjectMapper
import org.scalatra._
import model.{Mission, RouteDetails, Vehicle}
import org.json4s.DefaultFormats
import org.scalatra.json.JacksonJsonSupport
import org.json4s.jackson.Serialization.write


class MissionController extends ScalatraServlet with JacksonJsonSupport with CorsSupport  {
  implicit val jsonFormats = DefaultFormats

  before() {
    contentType = formats("json")
  }

  // TODO: remove, it's not necessary
  options("/*"){
    response.setHeader(
      "Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"));
  }

  get("/") {
    Mission.getMissions(None)
  }

  post("/") {
    val name = (parsedBody \ "name").extract[String]
    val startDate = (parsedBody \ "startDate").extract[String] // TODO: yyyy-mm-dd
    val vehicles = (parsedBody \ "vehicles").extract[Array[Vehicle]]
    val routeDetails = (parsedBody \ "route_details")
    /*val routeStart = (parsedBody \ "routeStart").extract[String]
    val routeFinish = (parsedBody \ "routeFinish").extract[String]*/

    val rdStart = (routeDetails \ "start").extract[String]
    val rdEnd = (routeDetails \ "end").extract[String]
    val rdPoints = compact(render(routeDetails \ "points"))
    val rdNNS = compact(render(routeDetails \ "noneNormalSegments"))

    val route = RouteDetails.create(rdStart, rdEnd, rdPoints, rdNNS)

    val m = Mission.create(name, startDate, scala.collection.mutable.Set[Vehicle](), route)
    Mission.addVehicles(m.id, vehicles)

    route
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
