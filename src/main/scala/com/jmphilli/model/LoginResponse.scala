package com.jmphilli.model 

case class LoginResponse(key: String, user: Option[User], wasRefreshed: Boolean)
