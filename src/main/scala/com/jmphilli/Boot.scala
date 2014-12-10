package com.jmphilli

import akka.actor.{ActorSystem, Props}
import akka.io.IO
import spray.can.Http
import akka.pattern.ask
import akka.util.Timeout
import scala.concurrent.duration._
import com.washboard.rest.ServiceActor
import com.washboard.config.Configuration
import com.washboard.dao.RedisSubscriber
import com.washboard.dao.SubscribeMessage
import com.redis._

object Boot extends App with Configuration {

  val ss = ActorSystem("sub")
  val s = ss.actorOf(Props(new RedisSubscriber))
  s ! SubscribeMessage(List("__key*__:*", "*"))

  // we need an ActorSystem to host our application in
  implicit val system = ActorSystem("on-spray-can")

  // create and start our service actor
  val service = system.actorOf(Props[ServiceActor], "demo-service")

  implicit val timeout = Timeout(5.seconds)
  // start a new HTTP server on port 8080 with our service actor as the handler
  IO(Http) ? Http.Bind(service, serviceHost, servicePort)
}
