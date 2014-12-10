package com.jmphilli.dao

import com.jmphilli.config.Configuration
import akka.actor.{ Actor, ActorSystem, Props }
import com.redis._

case class PublishMessage(channel: String, message: String)
case class SubscribeMessage(channels: List[String])
case class UnsubscribeMessage(channels: List[String])
case object GoDown

class RedisSubscriber extends Actor with Configuration with Namespaces{
  println("starting subscription service ..")
  val system = ActorSystem("sub")
  val r = new RedisClient(redisHost, redisPort)
  val s = system.actorOf(Props(new Subscriber(r)))
  s ! Register(callback) 

  def receive = {
    case SubscribeMessage(chs) => sub(chs.toArray)
    case UnsubscribeMessage(chs) => unsub(chs)
    case GoDown => 
      r.quit
      system.shutdown()
      system.awaitTermination()

    case x => println("Got in Sub case x" + x)
  }

  def sub(channels: Array[String]) = {
    r.pSubscribe(channels.head, channels.tail: _*)(callback)
  }

  def unsub(channels: List[String]) = {
    s ! Unsubscribe(channels.toArray)
  }

  def callback(pubsub: PubSubMessage) = pubsub match {
    case E(exception) => println("Fatal error caused consumer dead. Please init new consumer reconnecting to master or connect to backup")
    case S(channel, no) => println("subscribed to " + channel + " and count = " + no)
    case U(channel, no) => println("unsubscribed from " + channel + " and count = " + no)
    case M(channel, msg) => 
      msg match {
        // exit will unsubscribe from all channels and stop subscription service
        case "exit" => 
          println("unsubscribe all ..")
          r.unsubscribe

        // other message receive
        case x => 
          if(channel == "__keyevent@0__:expired") {
            if(msg.startsWith(UserNamespace)) {
              println("do somethin ya know")
            }
          }
          println("received message on channel " + channel + " as : " + x)
      }
    case _ => println("don't know what's going on")
  }
}
