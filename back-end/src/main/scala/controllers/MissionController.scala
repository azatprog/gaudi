package controllers

import org.scalatra._
import model.Mission
import org.json4s.DefaultFormats
import org.scalatra.json.JacksonJsonSupport

class MissionController extends ScalatraServlet with JacksonJsonSupport  {
  implicit val jsonFormats = DefaultFormats

  get("/") {
    contentType = formats("json")
    Mission.getMissions(None)
  }

  post("/") {
    contentType = formats("json")
    val name = (parsedBody \ "name").extract[String]
    val startDate = (parsedBody \ "startDate").extract[String]
    val routeStart = (parsedBody \ "routeStart").extract[String]
    val routeFinish = (parsedBody \ "routeFinish").extract[String]

    Mission.create(name, startDate, routeStart, routeFinish)
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
