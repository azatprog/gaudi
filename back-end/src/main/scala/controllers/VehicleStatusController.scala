package controllers

import model.VehicleStatus
import org.json4s.DefaultFormats
import org.scalatra.{CorsSupport, ScalatraServlet}
import org.scalatra.json.JacksonJsonSupport

class VehicleStatusController extends ScalatraServlet with JacksonJsonSupport with CorsSupport  {
  implicit val jsonFormats = DefaultFormats

  options("/*"){
    response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"))
  }

  before() {
    contentType = formats("json")
  }

  get("/") {
    val missionId = params.get("missionId").get.toLong
    val vehicleId = params.get("vehicleId").get.toLong
    val timeFromStart = params.getOrElse("timeFromMissionStart", "0")

    VehicleStatus.getVehicleStatuses(missionId, vehicleId, timeFromStart.toLong)
  }

  post("/") {
    val vehicleId = (parsedBody \ "vehicleId").extract[Long]
    val missionId = (parsedBody \ "missionId").extract[Long]
    val lng = (parsedBody \ "lng").extract[BigDecimal]
    val lat = (parsedBody \ "lat").extract[BigDecimal]
    val speed = (parsedBody \ "speed").extract[BigDecimal]
    val missionMilage = (parsedBody \ "missionMilage").extract[BigDecimal]
    val timeFromMissionStart = (parsedBody \ "timeFromMissionStart").extract[Long]
    val rpm = (parsedBody \ "rpm").extract[Int]
    val throttle = (parsedBody \ "throttle").extract[Int]
    val gear = (parsedBody \ "gear").extract[String]
    val pushBrakePedal = (parsedBody \ "pushBrakePedal").extract[Int]

    val vs = VehicleStatus.create(0, vehicleId, missionId, lng, lat,
      speed, missionMilage, timeFromMissionStart, rpm, throttle, gear, pushBrakePedal)
    vs
  }
}
