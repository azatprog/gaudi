package controllers

import model.{DbSchema, Mission, VehicleStatus}
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

  get("/deleteAll") {
    DbSchema.deleteAllVehicleStatuses()
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
    val missionMileage = (parsedBody \ "missionMileage").extract[BigDecimal]
    val timeFromMissionStart = (parsedBody \ "timeFromMissionStart").extract[Long]
    val rpm = (parsedBody \ "rpm").extract[Int]

    val engineTemperature = (parsedBody \ "engineTemperature").extractOrElse[Double](0)
    val outsideTemperature = (parsedBody \ "outsideTemperature").extractOrElse[Double](0)
    val oilPressure = (parsedBody \ "oilPressure").extractOrElse[Double](0)
    val coolingFluidLevel = (parsedBody \ "coolingFluidLevel").extractOrElse[Boolean](true)

    val throttle = (parsedBody \ "throttle").extractOrElse[Int](0)
    val gear = (parsedBody \ "gear").extractOrElse[String]("")
    val pushBrakePedal = (parsedBody \ "pushBrakePedal").extractOrElse[Int](0)

    val brakeTemperature = (parsedBody \ "brakeTemperature").extractOrElse[Double](0)
    val mass = (parsedBody \ "mass").extractOrElse[Int](0)

    val cumulBrakePedalPushingWeight = (parsedBody \ "cumulBrakePedalPushingWeight").extractOrElse[Int](0)
    val cumulBrakeHighTempOperation = (parsedBody \ "cumulBrakeHighTempOperation").extractOrElse[Int](0)
    val cumulDescentMileage = (parsedBody \ "cumulDescentMileage").extractOrElse[Double](0)
    val cumulEngineOperation = (parsedBody \ "cumulEngineOperation").extractOrElse[Int](0)
    val cumulEngineHighLoadOperation = (parsedBody \ "cumulEngineHighLoadOperation").extractOrElse[Int](0)
    val cumulEngineHighTempOperation = (parsedBody \ "cumulEngineHighTempOperation").extractOrElse[Int](0)
    val cumulGearOperation = (parsedBody \ "cumulGearOperation").extractOrElse[Int](0)
    val cumulGearHighLoadOperation = (parsedBody \ "cumulGearHighLoadOperation").extractOrElse[Int](0)
    val engineFault = (parsedBody \ "engineFault").extractOrElse[Boolean](false)
    val gearFault = (parsedBody \ "gearFault").extractOrElse[Boolean](false)
    val brakeFault = (parsedBody \ "brakeFault").extractOrElse[Boolean](false)

    val vs = VehicleStatus.create(0, vehicleId, missionId, lng, lat,
      speed, missionMileage, timeFromMissionStart, rpm, engineTemperature, outsideTemperature,
      oilPressure, coolingFluidLevel, throttle, gear, pushBrakePedal, brakeTemperature, mass,
      cumulBrakePedalPushingWeight, cumulBrakeHighTempOperation, cumulDescentMileage, cumulEngineOperation,
      cumulEngineHighLoadOperation, cumulEngineHighTempOperation, cumulGearOperation, cumulGearHighLoadOperation,
      engineFault, gearFault, brakeFault)
    vs
  }

  get("/:id/clear") {
    val id = params("id").toLong
    Mission.clearVehicleStatuses(id)
  }
}
