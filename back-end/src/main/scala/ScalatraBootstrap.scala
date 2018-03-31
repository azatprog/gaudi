import org.scalatra._
import javax.servlet.ServletContext

import controllers._

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext) {
    context.mount(new ViewController, "/api/*")
    context.mount(new MissionController, "/api/missions/*")
    context.mount(new VehicleController, "/api/vehicles/*")
  }
}
