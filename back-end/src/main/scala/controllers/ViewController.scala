package controllers

import model.DbSchema
import org.scalatra.ScalatraServlet

class ViewController extends ScalatraServlet {
  get("/") {
    contentType="text/html"
    //DbSchema.initDb()
    "Fleet Maintenance Prognostic System (db has been initialized)"
  }
}
