package models.file

import java.io.File

import org.apache.commons.io.FileUtils

import scala.io.Source

class BddFile {

  def saveFile(file: File, content: String, overwrite: Boolean): Boolean = {
    if (file.exists && !overwrite) {
      false
    } else {
      val parentDir = file.getParentFile
      if (parentDir != null) {
        parentDir.mkdirs()
      }
      writeStringToFile(file, content)
      true
    }
  }

  def deleteFile(file: File): Boolean = {
    file.delete()
  }

  def fileToString(file: File): Option[String] = {
    if (!file.exists || file.isDirectory) {
      Option.empty
    } else {
      val fileSource = sourceFromFile(file)
      val stringSource = fileSource.mkString
      fileSource.close()
      Option(stringSource)
    }
  }

  def listDirs(directory: File): List[String] = {
    directory.listFiles.filter(_.isDirectory).map(_.getName).toList
  }

  def listFiles(directory: File,
                recursive: Boolean = false,
                extension: Option[String] = Option.empty): List[String] = {
    if (directory.exists()) {
      val files = directory.listFiles()
      val filesInCurrentDir = files.filter(_.isFile).map(file => file.getName)
      val filesInSubDirs = files.filter(recursive && _.isDirectory).flatMap(listFiles(_, recursive))
      (filesInCurrentDir ++ filesInSubDirs).toList.filter(extension.isEmpty || _.endsWith(extension.get))
    } else {
      List()
    }
  }

  def createDirectory(directory: File): Unit = {
    if (!directory.exists) directory.mkdir()
  }

  private[file] def sourceFromFile(file: File) = {
    Source.fromFile(file, "UTF-8")
  }

  private[file] def writeStringToFile(file: File, content: String) {
    FileUtils.writeStringToFile(file, content, "UTF-8")
  }

}

object BddFile {

  def apply() = new BddFile()

}
