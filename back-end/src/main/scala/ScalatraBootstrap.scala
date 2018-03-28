import org.scalatra._
import javax.servlet.ServletContext

import controllers._

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext) {
    context.mount(new ViewController, "/*")
    context.mount(new MissionController, "/missions/*")
    context.mount(new VehicleController, "/vehicles/*")
  }
}
