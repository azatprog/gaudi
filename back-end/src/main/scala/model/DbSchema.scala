package model

import org.slf4j.LoggerFactory
import org.squeryl.PrimitiveTypeMode._
import org.squeryl.adapters.PostgreSqlAdapter
import org.squeryl.{Schema, Session, SessionFactory}

import scala.collection.mutable
import scala.collection.mutable.Set

object DbSchema extends Schema {
  val logger = LoggerFactory.getLogger(getClass)
  val dbConnection = "jdbc:postgresql://localhost/postgres"
  val dbUsername = "postgres"
  val dbPassword = "admin"

  val missions = table[Mission]
  val vehicles = table[Vehicle]
  val routeDetails = table[RouteDetails]

  val missionVehicles =
    manyToManyRelation(missions, vehicles).
      via[MissionVehicles](
      (m, v, mv) => (mv.vehicleId === v.id, m.id === mv.missionId)
    )
  val missionRoutes = manyToManyRelation(missions, routeDetails).
    via[MissionRoutes](
    (m, r, mr) => (mr.routeId === r.id, m.id === mr.missionId)
  )


  Class.forName("org.postgresql.Driver");

  SessionFactory.concreteFactory = Some(() =>
    Session.create(
      java.sql.DriverManager.getConnection(
        dbConnection, dbUsername, dbPassword),
      new PostgreSqlAdapter)
  )

  on(vehicles)(v => declare(
    v.vtype is(indexed, dbType("varchar(255)")),
    v.model is(indexed, dbType("varchar(255)")),
    v.sn is(indexed, dbType("varchar(255)")),
    v.state is dbType("smallint")
  ))

  on(missions)(m => declare(
    m.name is(indexed, dbType("varchar(255)")),
    m.startDate is(indexed, dbType("varchar(255)")),
  ))

  on(routeDetails)(rd => declare(
    rd.start is(indexed, dbType("varchar(255)")),
    rd.end is(indexed, dbType("varchar(255)")),
    rd.points is dbType("text"),
    rd.noneNormalSegments is dbType("text")
  ))

  def insert(v: Vehicle): Vehicle = {
    transaction {
      val vehicle = vehicles.insert(v)
      vehicle
    }
  }

  def insert(m: Mission): Mission = {
    transaction {
      val mission = missions.insert(m)
      mission
    }
  }

  def insert(rd: RouteDetails): RouteDetails = {
    transaction {
      val route = routeDetails.insert(rd)
      route
    }
  }

  def insertVehicles(mvs: List[MissionVehicles]): Unit = {
    transaction {
      missionVehicles.insert(mvs)
    }
  }

  def insertRoutes(mr: List[MissionRoutes]): Unit = {
    transaction {
      missionRoutes.insert(mr)
    }
  }

  def update(v: Vehicle): Vehicle = {
    transaction {
      val coll = from(vehicles)(
        veh => where(veh.id === v.id).select(veh))

      if (!coll.isEmpty) {
        vehicles.update(v)
        v
      } else insert(v)
    }
  }

  def update(m: Mission): Mission = {
    transaction {
      val coll = from(missions)(
        mis => where(mis.id === m.id).select(mis))

      if (!coll.isEmpty) {
        missions.update(m)
        m
      } else insert(m)
    }
  }

  def deleteVehicle(id: Long): Unit = {
    transaction {
      vehicles.deleteWhere(_.id === id)
    }
  }

  def deleteMission(id: Long): Unit = {
    transaction {
      vehicles.deleteWhere(_.id === id)
    }
  }

  def deleteMissionVehicles(mv: MissionVehicles): Unit = {
    /*transaction {
      missionVehicles.deleteWhere(_.missionId === mv.missionId && _.vehicleId === mv.vehicleId)
    }*/
  }

  def getAllVehicles(ids: Option[mutable.Set[Long]]): mutable.Set[Vehicle] = {
    val result = mutable.Set[Vehicle]()

    if (ids.isEmpty) {
      transaction {
        from(vehicles)(v => select(v))
          .foreach(v => result += v)
        result
      }
    } else {
      transaction {
        ids.get.foreach(id => {
          from(vehicles)(v => where(v.id === id).select(v))
            .foreach(v => result += v)
        })
        result
      }
    }
  }

  def getAllMissionVehicles() = {
    val result = Set[MissionVehicles]()
    transaction {
      from(missionVehicles)(mvs => select(mvs))
        .foreach(mvs => result += mvs)
      result
    }
  }

  def getAllMissions(ids: Option[Set[Long]]) = {
    val result = Set[Mission]()

    if (ids.isEmpty) {
      transaction {
        from(missions)(m => select(m))
          .foreach(m => result += m)
        result
      }
    } else {
      transaction {
        ids.get.foreach(id => {
          from(missions)(m => where(m.id === id).select(m))
            .foreach(m => result += m)
        })
        result
      }
    }
  }

  def initDb(): Unit = {
    transaction {
      Session.cleanupResources
      DbSchema.drop
      DbSchema.create
    }
  }

  def main(args: Array[String]): Unit = {
    transaction {
      Session.cleanupResources
      DbSchema.drop

      DbSchema.create
    }

    print(Vehicle.create("vehicle", "", "1", 100))
    print(Vehicle.create("", "", "2", 100))
    print(Vehicle.create("", "", "3", 100))

    /*print(Mission.create("mission 1", "", Set[Vehicle], ""))
    print(Mission.create("mission 2", "", "", ""))*/

    transaction {
      val vehicle = from(vehicles)(v => where(v.id === 2).select(v)).single
      println(vehicle)
      vehicle.vtype = "SUV"
      val newVehicle = vehicle
      println(newVehicle)
      Vehicle.update(newVehicle)
    }
    println(getAllVehicles(None))
    println(getAllVehicles(Some(Set[Long](1, 2))))

    Mission.addVehicles(1, Array[Long](1, 2, 3))
    println(Mission.getMissions(None))
  }
}
