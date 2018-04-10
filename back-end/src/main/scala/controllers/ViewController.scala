package controllers

import model.DbSchema
import org.scalatra.ScalatraServlet

class ViewController extends ScalatraServlet {
  get("/") {
    contentType="text/html"
    //DbSchema.initDb()
    "Hello! I'm Fleet Maintenance Prognostic System and <h1>I love the GAUDI team!</h1>"
  }
}
