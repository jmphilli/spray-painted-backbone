organization  := "com.example"

version       := "0.1"

scalaVersion  := "2.11.2"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")

libraryDependencies ++= {
  val akkaV = "2.3.5"
  val sprayV = "1.3.1"
  Seq(
    "io.spray"            %%  "spray-can"     % sprayV,
    "org.slf4j" % "slf4j-simple" % "1.6.2",
    "org.json4s" % "json4s-jackson_2.10" % "3.2.10",
    "io.spray"            %%  "spray-routing" % sprayV,
    "io.spray"            %%  "spray-testkit" % sprayV  % "test",
    "com.typesafe.akka"   %%  "akka-actor"    % akkaV,
    "com.typesafe.akka"   %%  "akka-testkit"  % akkaV   % "test",
    "org.specs2"          %%  "specs2-core"   % "2.3.11" % "test",
    "com.typesafe.slick"  %%  "slick"         % "2.1.0",
    "net.liftweb"         %  "lift-json_2.11"     % "3.0-+",
    "net.liftweb"         %  "lift-json-ext_2.11"     % "3.0-+",
    "mysql"               %  "mysql-connector-java" % "5.1.25",
    "com.roundeights" %% "hasher" % "1.0.0",
    "net.debasishg" %% "redisclient" % "2.13"
  )
}

resolvers ++= Seq(
    "RoundEights" at "http://maven.spikemark.net/roundeights"
)

Revolver.settings
