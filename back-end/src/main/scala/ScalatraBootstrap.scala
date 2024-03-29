import org.scalatra._
import javax.servlet.ServletContext

import controllers._

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext) {
    context.initParameters("org.scalatra.cors.allowedOrigins") = "http://localhost:4200"
    context.mount(new ViewController, "/api/resetAll/*")
    context.mount(new MissionController, "/api/missions/*")
    context.mount(new VehicleController, "/api/vehicles/*")
    context.mount(new VehicleStatusController, "/api/*")
    context.mount(new VehiclePrognosisController, "/api/vehiclePrognosis/*")
  }
}
