package com.jmphilli.model 

import scala.slick.driver.MySQLDriver.simple._
import com.roundeights.hasher.Implicits._

case class Laundromat(id: Option[Long], name: String, owner: Int, public: Int)

class Laundromats(tag: Tag) extends Table[Laundromat](tag, "laundromats") {

  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def name = column[String]("name")
  def owner = column[Int]("email")
  def public = column[Int]("public")

  def * = (id, name, owner, public) <> (Laundromat.tupled, Laundromat.unapply _)

}
