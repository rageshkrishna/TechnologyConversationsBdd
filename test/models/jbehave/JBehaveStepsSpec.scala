package models.jbehave

import org.specs2.mutable.Specification
import java.io.File
import play.api.libs.json.{Json, JsValue}
import org.jbehave.core.steps.{StepCandidate, Steps}
import org.specs2.matcher.JsonMatchers
import com.technologyconversations.bdd.steps.WebSteps
import com.technologyconversations.bdd.steps.Dummy
import com.technologyconversations.bdd.steps.util.BddOptionParam

class JBehaveStepsSpec extends Specification with JsonMatchers {
  
  val className = classOf[WebSteps].getName
  val noBddClassName = classOf[Dummy].getName

  "JBehaveSteps#stepsJars" should {

    val jars = JBehaveSteps().stepsJars

    "return a list of files" in {
      jars must beAnInstanceOf[List[File]]
      jars must not be empty
      jars(0) must beAnInstanceOf[File]
    }

  }

  "JBehaveSteps#classes" should {

    val composites = List("composites/something/TcBddComposites.java")
    val classes = JBehaveSteps("steps", composites).classes

    "return a list of all classes" in {
      classes.size must beGreaterThan(0)
    }

    "return classes that have at least one method annotated with Given, When or Then" in {
      classes must containPattern(".*WebSteps")
    }

    "return NOT return classes that do not have at least one method annotated with Given, When or Then" in {
      classes must not containPattern ".*Dummy"
    }

    "return composite classes" in {
      classes must containPattern("composites.*.TcBddComposites")
    }

  }

  "JBehaveSteps#hasSteps" should {

    "return true if class has at least one Given, When or Then annotation" in {
      JBehaveSteps().hasSteps(className) must beTrue
    }

    "return false if class does NOT have at least one Given, When or Then annotation" in {
      JBehaveSteps().hasSteps(noBddClassName) must beFalse
    }

  }
  
  "JBehaveSteps#classParams" should {

    val params = JBehaveSteps().classParams(className)
    
    "return List[String]" in {
      JBehaveSteps().classParams(className) must beAnInstanceOf[List[String]]
    }

    "return empty list if class does not have BddParams annotation" in {
      JBehaveSteps().classParams(noBddClassName) must have size 0
    }

    "return list of parameters with value" in {
      val list = params.map(_.value())
      list must not be empty
      list must contain("url")
    }

    "return list of parameters with description" in {
      val list = params.map(_.description())
      list must not be empty
      list must contain("Web address used with the 'Given Web home page is opened' step.")
    }
  }

  "JBehaveSteps#classParamsMap" should {

    val list = JBehaveSteps().classParamsMap(className)
    val listItem = list.head

    "return List[Map]" in {
      list must beAnInstanceOf[List[Map[String, String]]]
      listItem must beAnInstanceOf[Map[String, String]]
    }

    "return List with Map containing key" in {
      listItem must haveKey("key")
    }

    "return List with Map containing value" in {
      listItem must haveKey("value")
    }

    "return List with Map containing value from system properties" in {
      val expected = "THIS_IS_SYSTEM_PROPERTY"
      val key = listItem("key").toString.replace("\"", "")
      System.setProperty(className + "." + key, expected)
      val reloadedItem = JBehaveSteps().classParamsMap(className).head
      reloadedItem must havePair("value", Json.toJson(expected))
    }

    "return List with Map containing value that matches the system variable" in {
      listItem must haveKey("value")
    }

    "return List with Map containing description" in {
      listItem must haveKey("description")
    }

    "return List with Map containing options" in {
      listItem must haveKey("options")
    }

  }

  "JBehaveSteps#optionsToJson" should {

    val list = JBehaveSteps().classParams(className)
    // list(2) is the browser element.
    val browser = list.filter(_.value() == "browser").head
    val options = JBehaveSteps().optionsToJson(browser.options().toList)
    val firstOption = options.head

    "return List[Map]" in {
      list must beAnInstanceOf[List[Map[String, String]]]
      options must beAnInstanceOf[List[Map[String, JsValue]]]
      firstOption must beAnInstanceOf[Map[String, JsValue]]
    }

    "return empty if options list is empty" in {
      JBehaveSteps().optionsToJson(List[BddOptionParam]()) must be empty
    }

    "return List with Map containing text" in {
      firstOption must haveKey("text")
    }

    "return List with Map containing value" in {
      firstOption must haveKey("value")
    }

    "return List with Map containing isSelected" in {
      firstOption must haveKey("isSelected")
    }
  }

  "JBehaveSteps#steps" should {

    "return a list of all steps" in {
      val list = JBehaveSteps().steps
      list must beAnInstanceOf[List[Steps]]
      list.size must beGreaterThan(0)
      list.head must beAnInstanceOf[Steps]
    }

  }

  "JBehaveSteps#stepsCandidates" should {

    "return a list of all steps candidates" in {
      val list = JBehaveSteps().stepsCandidates
      list must beAnInstanceOf[List[Steps]]
      list.size must beGreaterThan(0)
      list.head must beAnInstanceOf[StepCandidate]
    }

  }


  "JBehaveSteps#stepsToJson" should {

    val json = JBehaveSteps().stepsToJson
    val jsonString = json.toString()

    "return JSON" in {
      json must beAnInstanceOf[JsValue]
    }

    "return JSON with type nodes" in {
      jsonString must /("steps") */("type" -> "GIVEN")
      jsonString must /("steps") */("type" -> "WHEN")
      jsonString must /("steps") */("type" -> "THEN")
    }

    "return JSON with step nodes" in {
      jsonString must /("steps") */("step" -> "Given .*".r)
      jsonString must /("steps") */("step" -> "When .*".r)
      jsonString must /("steps") */("step" -> "Then .*".r)
    }

  }

  "JBehaveSteps#classesToJson" should {

    val json = JBehaveSteps().classesToJson
    val jsonString = json.toString()

    "return JSON" in {
      json must beAnInstanceOf[JsValue]
    }

    "return JSON with name node" in {
      jsonString must /("classes") */("name" -> "WebSteps")
    }

    "return JSON with fullName node" in {
      jsonString must /("classes") */("fullName" -> endWith("WebSteps"))
    }

    "return JSON with params node" in {
      jsonString must /("classes") */("params") */("key" -> "browser")
    }

  }

}
