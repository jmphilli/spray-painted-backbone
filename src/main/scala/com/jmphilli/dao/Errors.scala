package com.jmphilli.dao

import com.jmphilli.model.Failure
import com.jmphilli.model.FailureType
import java.sql._

trait Errors {
  
  protected def databaseError(e: SQLException) =
    Failure("%d: %s".format(e.getErrorCode, e.getMessage), FailureType.DatabaseFailure)

  protected def notFoundError(varietalId: Long) =
    Failure("Entity with id=%d does not exist".format(varietalId), FailureType.NotFound)

  protected def notFoundError(name: String) =
    Failure("Entity with name=%s does not exist".format(name), FailureType.NotFound)

}
