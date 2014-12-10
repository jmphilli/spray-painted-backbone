package com.jmphilli.rest

import spray.httpx.LiftJsonSupport
import akka.actor.Actor
import com.jmphilli.rest._

class ServiceActor extends Actor with UserService with LoginService {
  def actorRefFactory = context
  def receive = runRoute(userRoute ~ loginRoute )
}
