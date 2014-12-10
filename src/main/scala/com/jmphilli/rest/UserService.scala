package com.jmphilli.rest

import org.json4s.JsonAST.JObject
import akka.event.Logging
import org.json4s.DefaultFormats
import akka.actor.Actor
import spray.routing._
import spray.http._
import MediaTypes._
import spray.httpx.unmarshalling._
import spray.httpx.LiftJsonSupport
import spray.http._
import net.liftweb.json.Serialization._
import com.jmphilli.model._
import com.jmphilli.dao._
import scala.concurrent.ExecutionContext.Implicits.global

trait UserService extends HttpService with LiftJsonSupport with UnmarshallerLifting with LiftJsonFormats with InstaAuth {

  private val userService = new UserDAO
  private def auth: Directive1[LoginResponse] = authenticate(authenticator)
  
  val userRoute = 
    path("users") {
      post {
        entity(as[User]) { user =>
          complete {
            userService.create(user)
          }
        }
      } ~ 
      get { 
        auth { authStr =>
          parameters('username) { (username) =>
            complete {
              userService.findByUsername(username)
            }
          }
        }
      }   
    } ~ 
    path("users" / LongNumber) { id =>
      auth { authStr =>
        get {
          complete {
            userService.search(id)
          }
        } ~
        put {
          entity(as[User]) { user =>
            complete {
              userService.update(id, user) 
            }
          }
        } ~
        delete {
          complete {
            userService.delete(id)
          }
        }
      }
    }
}
