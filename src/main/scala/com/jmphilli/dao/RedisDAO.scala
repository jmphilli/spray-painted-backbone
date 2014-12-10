package com.jmphilli.dao

import com.jmphilli.config.Configuration
import com.jmphilli.model._
import com.redis._

class RedisDAO extends Configuration with Errors with LiftJsonFormats with UserFunctions with Namespaces {

  private def r = new RedisClient(redisHost, redisPort)
  private def userDAO = new UserDAO

  val LoginTimeout = 300
  val RefreshTimeout = 120
  val DispensaryTimeout = -1

  def save(key:String, value:String, ttl:Int) = {
    r.set(key, value)
    if (ttl != -1) {
      r.expire(key, ttl)
    }
  }
  
  def clear(key:String) = {
    r.del(key)
  }

  def getUser(key:String):Option[LoginResponse] = {
    r.get(key) match {
      case Some(s:String) =>
        val savedUser = net.liftweb.json.Serialization.read[User](s)
        val user = savedUser.id match {
          case None =>
            userDAO.findByUsername(savedUser.username) match {
              case Right(u) => u
              case _ => savedUser
            }
          case _ => savedUser
        }
        Some(new LoginResponse(key, Some(user), false ))
      case None => None
    }
  }

  def getAndRefresh(key:String):Option[LoginResponse] = {
    this.getUser(key) match {
      case Some(lr:LoginResponse) =>
        lr.user match {
          case Some(u:User) =>
            r.ttl(key) match {
              case Some(l:Long) =>
                if(l < RefreshTimeout) {
                  val loginValue = getLoginValue(u)
                  this.save(key, loginValue, LoginTimeout)
                  Some(new LoginResponse(key, Some(u), true))
                } else {
                  Some(lr)
                }
              case None => None
            }
          case None => None
        }
      case None => None
    }
  }
}
