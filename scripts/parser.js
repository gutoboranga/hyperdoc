var fs = require('fs')
var path = require('path')

class Parser {
   
  constructor(indexes, titles, filenames) {
    this.indexes = indexes;
    this.titles = titles;
    this.filenames = filenames;
    
    this.parse();
  }
  
  parse() {
    let relativePath = '../contents/index.txt'
    let content = fs.readFileSync(path.join(__dirname, relativePath), { encoding: 'utf8' });

    try {
      let _this = this;
      let lines = content.split('\n')

      lines.forEach(function (element) {
          element = element.split(',')
          
          _this.indexes.push(element[0])
          _this.titles.push(element[1])
          
          let filename = element[2].split('.html')
          _this.filenames.push(filename[0])
      })
      
    } catch (e) {
        throw(e)
    }
  }
  
}

module.exports = {
  Parser: Parser
}
