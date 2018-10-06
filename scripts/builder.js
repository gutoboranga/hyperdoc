var fs = require('fs')
var path = require('path')
var DomParser = require('dom-parser');

class Builder {
  
  constructor(indexes, titles, filenames) {
    this.indexes = indexes;
    this.titles = titles;
    this.filenames = filenames;
    
    this.allowedModes = ["guided", "indexed", "guided-indexed"]
    
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
    
    // se o conteúdo pedido é inválido
    if (this.filenames.indexOf(file) < 0) {
      return 404;
    }
    
    let templatePath = path.join(__dirname, this.TEMPLATES_DIR + mode + this.TEMPLATE_EXT)
    let template = fs.readFileSync(templatePath, { encoding: 'utf8' });
    let dom = this.parse(template);
    
    let filePath = path.join(__dirname, this.CONTENT_DIR + file + this.CONTENT_EXT)
    let fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    
    dom.querySelector('#content').set_content(fileContent)
    
    switch (mode) {
      case "guided":
        return this.buildGuidedPage(dom, file);
        break;
    
      case "indexed":
        return this.buildIndexedPage(dom);
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
    let links = this.buildGuidedLinks(file)
    
    dom.querySelector('#previous').set_content(links[0])
    dom.querySelector('#next').set_content(links[1])
    
    return dom.toString();
  }
  
  buildIndexedPage(dom) {
    let listOfIndexes = this.buildListOfIndexes()
    
    dom.querySelector('#links_list').set_content(listOfIndexes)
    
    return dom.toString();
  }
  
  buildGuidedIndexedPage(dom, file) {
    let links = this.buildGuidedLinks(file)
    let listOfIndexes = this.buildListOfIndexes()
    
    dom.querySelector('#links_list').set_content(listOfIndexes)
    console.log(links);
    dom.querySelector('#previous').set_content(links[0])
    dom.querySelector('#next').set_content(links[1])
    
    return dom.toString();
  }
  
  buildListOfIndexes() {
    var list = []
    
    for (var i=0; i<this.filenames.length; i++) {
      var link = "<a href=\"" + this.filenames[i] + "\">" + this.titles[i] + "</a>"
      var item = "<li>" + link + "</li>"
      
      list.push(item)
    }
    
    return list
  }

  buildGuidedLinks(currentFile) {
    var previous = ""
    var next = ""
    
    console.log("file: " + currentFile);
    
    for (var i=0; i<this.indexes.length; i++) {
      if (this.filenames[i] == currentFile) {
        if (this.indexes.length > 1) {
          if (i == 0) {
            next = this.buildLinkDiv("next", this.filenames[i+1], this.titles[i+1])
          }
          
          else {
            previous = this.buildLinkDiv("previous", this.filenames[i-1], this.titles[i-1])
            
            if (i < (this.indexes.length - 1)) {
              next = this.buildLinkDiv("next", this.filenames[i+1], this.titles[i+1])
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
    
    html += "<div id=\"" + id + "\">"
    html += "<a class=\"link\" href=\"" + filename + "\">" + title + "</a>"
    html += "</div>"
    
    return html
  }
  
}

module.exports = {
  Builder: Builder
}
