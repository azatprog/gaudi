package controllers

import model.VehiclePrognosis
import org.json4s.DefaultFormats
import org.scalatra.{CorsSupport, ScalatraServlet}
import org.scalatra.json.JacksonJsonSupport

class VehiclePrognosisController extends ScalatraServlet with JacksonJsonSupport with CorsSupport  {
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

    VehiclePrognosis.getVehiclePrognosis(missionId, vehicleId)
  }

  post("/") {
    val vehicleId = (parsedBody \ "vehicleId").extract[Long]
    val missionId = (parsedBody \ "missionId").extract[Long]
    val lng = (parsedBody \ "lng").extract[BigDecimal]
    val lat = (parsedBody \ "lat").extract[BigDecimal]
    val successChance = (parsedBody \ "successChance").extract[Int]

    VehiclePrognosis.create(vehicleId, missionId, lng, lat, successChance)
  }
}
