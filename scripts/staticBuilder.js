var fs = require('fs')
var path = require('path')
var DomParser = require('dom-parser');

class StaticBuilder {

  constructor(indexes, titles, filenames) {
    this.indexes = indexes;
    this.titles = titles;
    this.filenames = filenames;

    this.allowedModes = ["guided", "indexed", "guided-indexed"]
    this.allowedModesLabels = ["Guiado", "Indexado", "Guiado-indexado"]

    this.BASE_URL = "http://localhost:5000/"

    this.TEMPLATES_DIR = "../templates/"
    this.TEMPLATE_EXT = ".html"

    this.CONTENT_DIR = "../contents/"
    this.CONTENT_EXT = ".html"

    this.parse= new require('node-html-parser').parse;
  }

  buildPage(mode, file) {
    // se é um modo inválido
    if (this.allowedModes.indexOf(mode) < 0) {
      return 404;
    }

    // se não forneceu nome, pega o primeiro e retorna a url dele pra dar redirect
    if (file == undefined) {
      return mode + "/" + this.filenames[0];
    }
    // se o conteúdo pedido é inválido
    else if (file != undefined && this.filenames.indexOf(file) < 0) {
      return 404;
    }

    let templatePath = path.join(__dirname, this.TEMPLATES_DIR + mode + this.TEMPLATE_EXT)
    let template = fs.readFileSync(templatePath, { encoding: 'utf8' });
    let dom = this.parse(template);

    let filePath = path.join(__dirname, this.CONTENT_DIR + file + this.CONTENT_EXT)
    let fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });

    dom.querySelector('#content').set_content(fileContent)
    dom.querySelector('#modes_buttons_container').set_content(this.buildModesLinks(file))

    switch (mode) {
      case "guided":
        return this.buildGuidedPage(dom, file);
        break;

      case "indexed":
        return this.buildIndexedPage(dom, file);
        break;

      case "guided-indexed":
        return this.buildGuidedIndexedPage(dom, file);
        break;

      default:
        break;
    }

    return 404;
  }

  buildGuidedPage(dom, file) {
    let links = this.buildGuidedLinks(file, "guided")

    dom.querySelector('#previous').set_content(links[0])
    dom.querySelector('#next').set_content(links[1])

    return dom.toString();
  }

  buildIndexedPage(dom, file) {
    let listOfIndexes = this.buildListOfIndexes(file, "indexed")

    dom.querySelector('#links_list').set_content(listOfIndexes)

    return dom.toString();
  }

  buildGuidedIndexedPage(dom, file) {
    let links = this.buildGuidedLinks(file, "guided-indexed")
    let listOfIndexes = this.buildListOfIndexes(file, "guided-indexed")

    dom.querySelector('#links_list').set_content(listOfIndexes)
    dom.querySelector('#previous').set_content(links[0])
    dom.querySelector('#next').set_content(links[1])

    return dom.toString();
  }

  buildListOfIndexes(file, mode) {
    var list = []

    for (var i=0; i<this.filenames.length; i++) {
        let filename = this.createFileName(this.filenames[i], mode)
      var link = "<a class=\"index_link\" href=\"" + filename + "\">" + this.titles[i] + "</a>"
      var item = "<li"

      if (this.filenames[i] == file) {
        item += " class=\"current_link\""
      }

      item += ">" + link + "</li>"

      list.push(item)
    }

    return list
  }

  buildGuidedLinks(currentFile, mode) {
    var previous = ""
    var next = ""

    for (var i=0; i<this.indexes.length; i++) {
      if (this.filenames[i] == currentFile) {
        if (this.indexes.length > 1) {
          if (i == 0) {
            let filename = this.createFileName(this.filenames[i+1], mode)
            next = this.buildLinkDiv("next", filename, this.titles[i+1])
          }

          else {
            let filename = this.createFileName(this.filenames[i-1], mode)
            previous = this.buildLinkDiv("previous", filename, this.titles[i-1])

            if (i < (this.indexes.length - 1)) {
                let filename = this.createFileName(this.filenames[i+1], mode)
                next = this.buildLinkDiv("next", filename, this.titles[i+1])
            }
          }
        }
        break
      }
    }

    return [previous, next]
  }

  buildLinkDiv(id, filename, title) {
    var html = ""

    html += "<a class=\"link\" href=\"" + filename + "\">" + title + "</a>"

    return html
  }

  buildModesLinks(file) {
    var html = ""

    for (var i = 0; i < this.allowedModes.length; i++) {
        let mode = this.allowedModes[i]
        let filename = this.createFileName(file, mode)

        let link = "<a class=\"modes_button\" href=\"" + filename + "\">" + this.allowedModesLabels[i] + "</a>" + "<br>"

        html += link
    }

    return html
  }

  createFileName(name, mode) {
      return name + "_" + mode + ".html";
  }

}

module.exports = {
  StaticBuilder: StaticBuilder
}
