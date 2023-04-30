# Grunt

Grunt will generate content indexes to package along with Hugo static content.

This is inspired by [Sebastien Moran's demo of this idea](https://gist.github.com/sebz/efddfc8fdcb6b480f567) with
some changes and improvements to work in this project. 

## How it works

The bulk of indexing code is `Grunt.js`. Here's a quick overview of what happens:
1. Scan all files under `/content`
   1. For each file, scrape metadata such as title, tags, and description
1. Save scraped content along with a link to the respective file at `static/js/lunr/index.json`

## Preconditions

```shell
npm install --save-dev
```

## Run

```shell
./lunr-indexes.sh
```
