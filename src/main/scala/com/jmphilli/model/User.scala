package com.jmphilli.model 

import scala.slick.driver.MySQLDriver.simple._
import com.roundeights.hasher.Implicits._

case class User(id: Option[Long], username: String, password: String)

trait UserFunctions extends LiftJsonFormats {

  /** you should change these buddy TODO **/
  private val PasswordSalt = """W_M#(OzE!xs}>KFnp+FDJW\\U,B\#1EYM~j;F:br@Jc$S^Fx(Sg-LR*%|;qk=+ug""" 
  private val LoginSalt =    """uR%T'6P>};gO.P3gM^((`hT>0<53+$W9*cR#6o'/}(;Ri2bU9BLmmz:HGG=r1Me0"""

  def hashAndSaltPassword(password: String):String = {
    return password.salt(PasswordSalt).sha512.hex
  }

  def getHashedAndSaltedUser(user: User): User = {
    val hashedAndSaltedPassword = hashAndSaltPassword(user.password)
    User(user.id, user.username, hashedAndSaltedPassword)
  }

  def getLoginKey(user: User): String = {
    val string = user.username + user.password + System.currentTimeMillis
    return string.salt(LoginSalt).sha512.hex
  }

  def getLoginValue(user: User): String = {
    net.liftweb.json.Serialization.write(user)
  }

}

class Users(tag: Tag) extends Table[User](tag, "users") {

  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def username = column[String]("username")
  def password = column[String]("password")

  def * = (id, username, password) <> (User.tupled, User.unapply _)

}
