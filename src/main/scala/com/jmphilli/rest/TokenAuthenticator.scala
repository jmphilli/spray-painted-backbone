package com.jmphilli.rest

import scala.concurrent.{ExecutionContext, Future}
import spray.routing.{AuthenticationFailedRejection, RequestContext}
import spray.routing.authentication.{Authentication, ContextAuthenticator}
import scala.concurrent.ExecutionContext.Implicits.global
import com.jmphilli.dao.RedisDAO
import com.jmphilli.model.LoginResponse
import spray.routing._
 
object TokenAuthenticator {
 
  object TokenExtraction {
 
    type TokenExtractor = RequestContext => Option[String]
 
    def fromHeader(headerName: String): TokenExtractor = { context: RequestContext =>
      context.request.headers.find(_.name == headerName).map(_.value)
    }
 
  }
 
  class TokenAuthenticator[T](extractor: TokenExtraction.TokenExtractor, authenticator: (String => Future[Option[T]]))
    (implicit executionContext: ExecutionContext) extends ContextAuthenticator[T] {
 
    import AuthenticationFailedRejection._
 
    def apply(context: RequestContext): Future[Authentication[T]] =
      extractor(context) match {
        case None =>
          Future(
            Left(AuthenticationFailedRejection(CredentialsMissing, List()))
          )
        case Some(token) =>
          authenticator(token) map {
            case Some(t) =>
              Right(t)
            case None =>
              Left(AuthenticationFailedRejection(CredentialsRejected, List()))
          }
      }
 
  }
 
  def apply[T](headerName: String, queryStringParameterName: String)(authenticator: (String => Future[Option[T]]))
    (implicit executionContext: ExecutionContext) = {
 
    def extractor(context: RequestContext) =
      TokenExtraction.fromHeader(headerName)(context) /*orElse
        TokenExtraction.fromQueryString(queryStringParameterName)(context)*/
 
    new TokenAuthenticator(extractor, authenticator)
  }
 
}


trait InstaAuth {
  
  private val cacheService = new RedisDAO

  val authenticator = TokenAuthenticator[LoginResponse] (headerName = "jmphilli-auth", "") { key =>
    Future(cacheService.getAndRefresh(key))
  }

}
