const yamljs = require("yamljs");
const S = require("string");
const fs = require("fs")

const CONTENT_PATH_PREFIX = "../content";
const INDEX_PATH = "../static/js/lunr/index.json"
const GITHUB_CONTENT = "../../script/gh"

module.exports = function(grunt) {
    grunt.registerTask("lunr-index", function() {
        try {
            let index = indexContent(grunt);

            index = index.concat(indexGists(grunt))
            index = index.concat(indexPrs(grunt))

            console.log(JSON.stringify(index, null, "  "))

            grunt.file.write(INDEX_PATH, JSON.stringify(index, null, "  "));
        } catch(e) {
            grunt.log.error(e);
            throw e;
        }
    });
};

/**
 * Turn local prs file into a set of indexes
 *
 * @param grunt
 * @returns [{title, tag, href, summary}]
 */
function indexPrs(grunt) {
    grunt.log.writeln("Building GH/prs index");
    const path = `${GITHUB_CONTENT}/prs.json`;

    let indexes = [];
    if (!fs.existsSync(path)) {
        grunt.log.writeln("GH/prs file does not exist. Skipping.")
        return indexes
    }
    let content;
    try {
        content = grunt.file.read(path);
    } catch (e) {
        grunt.log.error("Error loading GH/prs, file may not exist: ", e)
        return indexes;
    }

    const prs = JSON.parse(content)
    for (const pr of prs) {
        var body = "";
        if (pr.body != null && pr.body.length > 0) {
            body = pr.body.substr(0, 150) + " ...";
        }
        indexes.push({
            title: `[GitHub PR] ${pr.repository.nameWithOwner}: ${pr.title}`,
            href: pr.url,
            summary: `[${pr.state}] ${body}`,
            date: new Date(pr.updatedAt),
        })
    }
    return indexes;
}

/**
 * Turn local gists file into a set of indexes
 *
 * @param grunt
 * @returns [{title, tag, href, summary}]
 */
function indexGists(grunt) {
    grunt.log.writeln("Building GH/gist index");
    const pathToGists = `${GITHUB_CONTENT}/gists.json`;

    let indexes = [];
    if (!fs.existsSync(pathToGists)) {
        grunt.log.writeln("Gists file does not exist. Skipping.")
        return indexes
    }
    let content;
    try {
        content = grunt.file.read(pathToGists);
    } catch (e) {
        grunt.log.error("Error loading gists, file may not exist: ", e)
        return indexes;
    }

    console.log("Finished reading gist content")

    // find example of what gist looks like at examples/gist.json
    const gists = JSON.parse(content)
    for (const gist of gists) {
        if (!gist.public) {
            continue;
        }
        let gistFiles = [];
        let tags = [];
        for (const [_, value] of Object.entries(gist.files)) {
            gistFiles.push(value.filename);
            if (value.language != null) {
                tags.push(value.language);
            }
        }
        indexes.push({
            title: `[GitHub Gist] ${gist.description}`,
            href: gist.html_url,
            tags: tags,
            summary: `${gistFiles.join(", ")}`,
            date: new Date(gist.updated_at),
        })
    }

    return indexes;
}

/**
 *
 * @param grunt
 * @returns [{title, tag, href, summary}]
 */
function indexContent(grunt) {
    grunt.log.writeln("Build /content index");
    const indexPages = function () {
        const pagesIndex = [];
        grunt.file.recurse(CONTENT_PATH_PREFIX, function (abspath, rootdir, subdir, filename) {
            grunt.verbose.writeln("\n\nParse file:", abspath);
            const index = processFile(abspath, filename);
            if (index != null) {
                grunt.verbose.writeln(`Added index ${JSON.stringify(index, null, "  ")}`)
                pagesIndex.push(index);
            }
        });
        return pagesIndex;
    };

    const processFile = function(abspath, filename) {
        let pageIndex = null;

        if (S(filename).endsWith(".html")) {
            pageIndex = processHTMLFile(abspath, filename);
        } else if (S(filename).endsWith(".md")) {
            pageIndex = processMDFile(abspath, filename);
        } else {
            grunt.verbose.writeln(`Skipping file (no extension handler): ${abspath}`)
        }

        return pageIndex;
    };

    const processHTMLFile = function(abspath, filename) {
        const content = grunt.file.read(abspath);
        const pageName = S(filename).chompRight(".html").s;
        const href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).s;
        return {
            title: pageName,
            href: href,
            content: S(content).trim().stripTags().stripPunctuation().s
        };
    };

    const processMDFile = function(abspath, filename) {
        let content = grunt.file.read(abspath);
        // First separate the Front Matter from the content and parse it
        content = content.split("---");
        let frontMatter;
        try {
            frontMatter = yamljs.parse(content[1].trim());
        } catch (e) {
            grunt.log.writeln(e.message);
            return
        }

        let href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(".md").s;
        // href for index.md files stops at the folder name
        if (filename === "index.md") {
            href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
        }

        // Build Lunr index for this page
        let lunr = {
            title: frontMatter.title,
            tags: frontMatter.tags,
            href: href,
            summary: frontMatter.summary,
            date: new Date(frontMatter.date),
        };

        console.log("lunr: ", lunr)
        return lunr
    };

    grunt.log.ok("Finished indexing /content")
    return indexPages();
}