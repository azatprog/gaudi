package controllers

import org.scalatra._
import model.{Mission, Vehicle}
import org.json4s.DefaultFormats
import org.scalatra.json.JacksonJsonSupport

class MissionController extends ScalatraServlet with JacksonJsonSupport with CorsSupport  {
  implicit val jsonFormats = DefaultFormats

  options("/*"){
    response.setHeader(
      "Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"));
  }

  get("/") {
    contentType = formats("json")
    Mission.getMissions(None)
  }

  post("/") {
    contentType = formats("json")
    val name = (parsedBody \ "name").extract[String]
    val startDate = (parsedBody \ "startDate").extract[String] // TODO: yyyy-mm-dd
    val vehicles = (parsedBody \ "vehicles").extract[Array[Vehicle]]
    val routeStart = (parsedBody \ "routeStart").extract[String]
    val routeFinish = (parsedBody \ "routeFinish").extract[String]

    val m = Mission.create(name, startDate, routeStart, routeFinish)
    Mission.addVehicles(m.id, vehicles)
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
