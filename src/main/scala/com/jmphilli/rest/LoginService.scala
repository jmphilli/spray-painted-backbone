package com.jmphilli.rest

import org.json4s.JsonAST.JObject
import akka.event.Logging
import org.json4s.DefaultFormats
import akka.actor.Actor
import spray.httpx.unmarshalling._
import spray.httpx.LiftJsonSupport
import spray.routing._
import spray.http._
import MediaTypes._
import net.liftweb.json.Serialization._
import com.jmphilli.model._
import com.jmphilli.dao._

trait LoginService extends HttpService with LiftJsonSupport with UnmarshallerLifting with LiftJsonFormats with UserFunctions {

  private val cacheService = new RedisDAO
  private val userService = new UserDAO

  val loginRoute =
    path("login") {
        post {
          entity(as[User]) { user =>
            complete {
              val loginKey = getLoginKey(user)
              val loginValue = getLoginValue(user)
              var loginResponse = new LoginResponse("", None, false)
              userService.checkPassword(user) match {
                case Right(Some(dbUser)) =>
                    cacheService.save(loginKey, loginValue, cacheService.LoginTimeout)
                    loginResponse = new LoginResponse(loginKey, Some(dbUser), true)
                case Left(dbError) => 
                    Left(dbError)
                case _ =>
              }
              loginResponse
            }
          }
        } 
    }
}
