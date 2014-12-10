package com.jmphilli.model

import net.liftweb.json.ext.EnumNameSerializer

trait LiftJsonFormats {
  implicit val liftJsonFormats = net.liftweb.json.DefaultFormats 
}
