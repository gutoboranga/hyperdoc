var Parser = require('./parser').Parser
var StaticBuilder = require('./staticBuilder').StaticBuilder
var path = require('path')
var fs = require('fs')

let STATIC_CONTENT_DIR = "../static_content/"
let STATIC_CONTENT_HTML_DIR = STATIC_CONTENT_DIR + "html/"
let FILE_EXT = ".html"
let STYLESHEETS = ["main", "guided", "indexed", "guided-indexed"]
let STYLESHEETS_DIR = "../style/"

function generate(builder) {

    // cria as páginas e copia pra pasta ../static_content/html
    for (var i = 0; i < builder.filenames.length; i++) {
        for (var j = 0; j < builder.allowedModes.length; j++) {
            let page = builder.buildPage(builder.allowedModes[j], builder.filenames[i])

            let filename = builder.filenames[i] + "_" + builder.allowedModes[j]
            let filepath = path.join(__dirname, STATIC_CONTENT_HTML_DIR + filename + FILE_EXT)

            console.log(filepath)

            fs.writeFileSync(filepath, page)
        }
    }


    // cria a página index
    let sourcePath = path.join(__dirname, "../templates/index.html")
    let destinationPath = path.join(__dirname, STATIC_CONTENT_HTML_DIR + "index.html")
    let index = fs.readFileSync(sourcePath, { encoding: 'utf8' })

    let html_parse = new require('node-html-parser').parse;
    let dom = html_parse(index);

    dom.querySelector('#guided_link').set_content("<a href=\"" + builder.filenames[0] + "_guided.html\">Guiado</a>")
    dom.querySelector('#indexed_link').set_content("<a href=\"" + builder.filenames[0] + "_indexed.html\">Indexado</a>")
    dom.querySelector('#guided-indexed_link').set_content("<a href=\"" + builder.filenames[0] + "_guided-indexed.html\">Guiado-indexado</a>")

    // console.log(dom.toString());
    fs.writeFileSync(destinationPath, dom.toString())

    // copia os arquivos css pra pasta ../static_content/
    for (var i = 0; i < STYLESHEETS.length; i++) {
        let sourcePath = path.join(__dirname, STYLESHEETS_DIR + STYLESHEETS[i] + ".css")
        let content = fs.readFileSync(sourcePath, { encoding: 'utf8' });

        let destinationPath = path.join(__dirname, STATIC_CONTENT_DIR + STYLESHEETS[i] + ".css")
        fs.writeFileSync(destinationPath, content, 'utf8', function (err) {})
    }

}

let parser = new Parser([],[],[]);
let builder = new StaticBuilder(parser.indexes, parser.titles, parser.filenames);

generate(builder)
