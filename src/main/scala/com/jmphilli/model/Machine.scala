package com.jmphilli.model 

import scala.slick.driver.MySQLDriver.simple._
import com.roundeights.hasher.Implicits._

case class Machine(id: Option[Long], machineType:Int, name: String)

class Machines(tag: Tag) extends Table[Machine](tag, "machines") {

  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def machineType = column[Int]("machine_type")
  def name = column[String]("name")

  def * = (id, machineType, name) <> (Machine.tupled, Machine.unapply _)

}
