package com.inno.sierra

import controllers.ViewController
import org.scalatra.test.scalatest._

class MainServletTests extends ScalatraFunSuite {

  addServlet(classOf[ViewController], "/*")

  test("GET / on MainServlet should return status 200"){
    get("/"){
      status should equal (200)
    }
  }

}
