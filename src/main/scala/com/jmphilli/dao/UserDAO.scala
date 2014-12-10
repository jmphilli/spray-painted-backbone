package com.jmphilli.dao

import com.jmphilli.config.Configuration
import com.jmphilli.model._
import java.sql._
import scala.Some
import scala.slick.driver.MySQLDriver.simple._
import slick.jdbc.meta.MTable

class UserDAO extends Configuration with Errors with UserFunctions {

  private val db = Database.forURL(url = "jdbc:mysql://%s:%d/%s".format(dbHost, dbPort, dbName),
    user = dbUser, password = dbPassword, driver = "com.mysql.jdbc.Driver")

  private val users = TableQuery[Users]

  def checkPassword(user: User): Either[Failure, Option[User]] = {
    try {
      db.withSession {
        implicit session =>
        val hashedAndSaltedUser = getHashedAndSaltedUser(user)
        searchByUsernameDirty(user.username) match {
          case Right(dbUser) =>
            if(dbUser.password == hashedAndSaltedUser.password) {
              Right(Some(dbUser))
            } else {
              Right(None)
            }
          case Left(dbError) =>
            Left(dbError)
        }
      }
    } catch {
      case e: SQLException =>
        Left(databaseError(e))
    }
  }

  def create(user: User): Either[Failure, User] = {
    try {
      db.withSession {
        implicit session =>
        val hashedAndSaltedUser = getHashedAndSaltedUser(user)
        val newId = (users returning users.map(_.id)) += (hashedAndSaltedUser)
        val newUser = User(newId, hashedAndSaltedUser.username, "password")
        Right(newUser)
      }
    } catch {
      case e: SQLException =>
        Left(databaseError(e))
    }
  }

  def update(id: Long, user: User): Either[Failure, User] = {
    try
      db.withSession {
        implicit session =>
        val hashedAndSaltedUser = getHashedAndSaltedUser(user)
        val result = users.filter(_.id === id).update(hashedAndSaltedUser)
        Right(user)
      }
    catch {
      case e: SQLException =>
        Left(databaseError(e))
    }
  }

  def delete(id: Long): Either[Failure, User] = {
    try {
      db.withSession {
        implicit session =>
        val result = users.filter(_.id === id)
        result.firstOption match {
          case Some(user: User) =>
            val deleteCount = users.filter(_.id === id).delete
            val sanitizedUser = User(user.id, user.username, "password")
            Right(sanitizedUser)
          case _ =>
            Left(notFoundError(id))
        }
      }
    } catch {
      case e: SQLException =>
        Left(databaseError(e))
    }
  }

  def search(id: Long): Either[Failure, User] = {
    try {
      db.withSession {
        implicit session =>
        val result = users.filter(_.id === id)
        result.firstOption match {
          case Some(user: User) =>
            val sanitizedUser = User(user.id, user.username, "password")
            Right(sanitizedUser)
          case _ =>
            Left(notFoundError(id))
        }
      }
    } catch {
      case e: SQLException =>
        Left(databaseError(e))
    }
  }

  def searchByUsernameDirty(username:String): Either[Failure, User] = {
    try {
      db.withSession {
        implicit session =>
        val result = users.filter(_.username === username)
        result.firstOption match {
          case Some(user: User) =>
            Right(user)
          case _ =>
            Left(notFoundError(username))
        }
      }
    } catch {
      case e: SQLException =>
        Left(databaseError(e))
    }
  }

  def findByUsername(username : String) : Either[Failure, User] = {
    try {
      db.withSession {
        implicit session =>
        val result = users.filter(_.username === username)
        result.firstOption match {
          case Some(user: User) =>
            val sanitizedUser = User(user.id, user.username, "password")
            Right(sanitizedUser)
          case _ =>
            Left(notFoundError(username))
        }
      }
    } catch {
      case e: SQLException =>
        Left(databaseError(e))
    }
  }
}
