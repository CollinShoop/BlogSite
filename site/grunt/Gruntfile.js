const yamljs = require("yamljs");
const S = require("string");

const CONTENT_PATH_PREFIX = "../content";
const INDEX_PATH = "../static/js/lunr/index.json"

module.exports = function(grunt) {
    grunt.registerTask("lunr-index", function() {

        grunt.log.writeln("Build pages index");

        var indexPages = function() {
            var pagesIndex = [];
            grunt.file.recurse(CONTENT_PATH_PREFIX, function(abspath, rootdir, subdir, filename) {
                grunt.verbose.writeln("\n\nParse file:",abspath);
                const index = processFile(abspath, filename);
                if (index != null) {
                    grunt.verbose.writeln(`Added index ${JSON.stringify(index, null, "  ")}`)
                    pagesIndex.push(index);
                }
            });
            return pagesIndex;
        };

        var processFile = function(abspath, filename) {
            var pageIndex = null;

            if (S(filename).endsWith(".html")) {
                pageIndex = processHTMLFile(abspath, filename);
            } else if (S(filename).endsWith(".md")) {
                pageIndex = processMDFile(abspath, filename);
            } else {
                grunt.verbose.writeln(`Skipping file (no extension handler): ${abspath}`)
            }

            return pageIndex;
        };

        var processHTMLFile = function(abspath, filename) {
            var content = grunt.file.read(abspath);
            var pageName = S(filename).chompRight(".html").s;
            var href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).s;
            return {
                title: pageName,
                href: href,
                content: S(content).trim().stripTags().stripPunctuation().s
            };
        };

        var processMDFile = function(abspath, filename) {
            var content = grunt.file.read(abspath);
            // First separate the Front Matter from the content and parse it
            content = content.split("---");
            var frontMatter;
            try {
                frontMatter = yamljs.parse(content[1].trim());
            } catch (e) {
                grunt.log.writeln(e.message);
                return
            }

            var href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(".md").s;
            // href for index.md files stops at the folder name
            if (filename === "index.md") {
                href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
            }

            // Build Lunr index for this page
            return {
                title: frontMatter.title,
                tags: frontMatter.tags,
                href: href,
                summary: frontMatter.summary,
            };
        };

        grunt.file.write(INDEX_PATH, JSON.stringify(indexPages(), null, "  "));
        grunt.log.ok("Index built");
    });
};