package models.file

import java.io.File

@deprecated("Use BddFile instead")
trait FileTraitStory extends BddFileTrait {

  def name: String = new File(fullPath).getName.split('.').init.mkString(".")

}
