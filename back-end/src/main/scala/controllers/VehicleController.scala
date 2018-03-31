package controllers

import model.{Mission, Vehicle}
import org.json4s.DefaultFormats
import org.scalatra._
import org.scalatra.json.JacksonJsonSupport

class VehicleController extends ScalatraServlet with JacksonJsonSupport with CorsSupport  {
  implicit val jsonFormats = DefaultFormats

  options("/*"){
    response.setHeader(
      "Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"));
  }

  get("/") {
    contentType = formats("json")
    Vehicle.getVehicles(None)
  }

  post("/") {
    contentType = formats("json")
    val vtype = (parsedBody \ "vtype").extract[String]
    val model = (parsedBody \ "model").extract[String]
    val sn = (parsedBody \ "sn").extract[String]
    val state = (parsedBody \ "state").extract[Int]

    Vehicle.create(vtype, model, sn, state)
  }

  put("/") {
    val jValue = parse(request.body)
    val vehicle = jValue.extract[Vehicle]
    println("vehicle to update: " + vehicle)
    Vehicle.update(vehicle)
  }

  delete("/:id") {
    val id = params("id").toLong
    Vehicle.delete(id)
  }
}
