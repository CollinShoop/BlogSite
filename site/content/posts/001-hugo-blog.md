---
title: "Creating this website w/Hugo"
date: 2022-09-03T20:58:42-04:00
author: "Collin Shoop"
cover: "/img/under-construction.png"
description: "How I deployed a Hugo static website to Google Cloud in just a few quick hours!"
tags: ["hugo", "web", "first"]
draft: false
---

{{< image src="/img/under-construction.png" position="center" >}}

## Helpful references
1. https://gohugo.io/getting-started/quick-start/
1. https://gohugo.io/getting-started/quick-start/#step-7-build-static-pages 

## Hugo config
{{< code language="toml" title="Really cool snippet" id="1" expand="Show" collapse="Hide" isCollapsed="true" >}}
baseurl = "/"
languageCode = "en-us"
title = 'My New Hugo Site'
theme = "hello-friend"
paginate = 5

[params]
# dir name of your blog content (default is `content/posts`).
# the list of set content will show up on your index page (baseurl).
contentTypeName = "posts"

# OS theme is default when not provided, but you can force it to "light" or "dark"
defaultTheme = "dark"

# if you set this to 0, only submenu trigger will be visible
showMenuItems = 3

# Show reading time in minutes for posts
showReadingTime = false

# Show table of contents at the top of your posts (defaults to false)
# Alternatively, add this param to post front matter for specific posts
# toc = true

# Show full page content in RSS feed items
#(default is Description or Summary metadata in the front matter)
# rssFullText = true

[languages]
[languages.en]
title = "CShoop"
keywords = ""
copyright = ""
menuMore = "Show more"
writtenBy = "Collin Shoop"
readMore = "Read more"
readOtherPosts = "Read other posts"
newerPosts = "Newer posts"
olderPosts = "Older posts"
minuteReadingTime = "min read"
dateFormatSingle = "2006-01-02"
dateFormatList = "2006-01-02"
# leave empty to disable, enter display text to enable
lastModDisplay = "Last modified:"

    [languages.en.params.logo]
      logoText = "CS"
      logoHomeLink = "/"
    # or
    # path = "/img/your-example-logo.svg"
    # alt = "Your example logo alt text"

    [languages.en.menu]
      [[languages.en.menu.main]]
        identifier = "about"
        name = "About"
        url = "/about"
      [[languages.en.menu.main]]
        identifier = "Projects"
        name = "Projects"
        url = "/projects"
      [[languages.en.menu.main]]
        identifier = "resume"
        name = "Resume"
        url = "/resume.pdf"
        target = "_blank"

[deployment]
# By default, files are uploaded in an arbitrary order.
# Files that match the regular expressions in the "Order" list
# will be uploaded first, in the listed order.
order = [".jpg$", ".gif$"]


[[deployment.targets]]
# An arbitrary name for this target.
name = "cssite"
# The Go Cloud Development Kit URL to deploy to. Examples:
# GCS; see https://gocloud.dev/howto/blob/#gcs
URL = "gs://cshoop-hugo"

# You can use a "prefix=" query parameter to target a subfolder of the bucket:
# URL = "gs://<Bucket Name>?prefix=a/subfolder/"

# If you are using a CloudFront CDN, deploy will invalidate the cache as needed.
# cloudFrontDistributionID =

# Optionally, you can include or exclude specific files.
# See https://godoc.org/github.com/gobwas/glob#Glob for the glob pattern syntax.
# If non-empty, the pattern is matched against the local path.
# All paths are matched against in their filepath.ToSlash form.
# If exclude is non-empty, and a local or remote file's path matches it, that file is not synced.
# If include is non-empty, and a local or remote file's path does not match it, that file is not synced.
# As a result, local files that don't pass the include/exclude filters are not uploaded to remote,
# and remote files that don't pass the include/exclude filters are not deleted.
include = ""
# exclude = "**.{jpg, png}" # would exclude files with ".jpg" or ".png" suffix


# [[deployment.matchers]] configure behavior for files that match the Pattern.
# See https://golang.org/pkg/regexp/syntax/ for pattern syntax.
# Pattern searching is stopped on first match.

# Samples:

[[deployment.matchers]]
# Cache static assets for 1 year.
pattern = "^.+\\.(js|css|svg|ttf)$"
cacheControl = "max-age=31536000, no-transform, public"
gzip = true

[[deployment.matchers]]
pattern = "^.+\\.(png|jpg)$"
cacheControl = "max-age=31536000, no-transform, public"
gzip = false

[[deployment.matchers]]
# Set custom content type for /sitemap.xml
pattern = "^sitemap\\.xml$"
contentType = "application/xml"
gzip = true

[[deployment.matchers]]
pattern = "^.+\\.(html|xml|json)$"
gzip = true
{{< /code >}}


## Helper Make
```makefile
start:
	hugo server -t hello-friend --disableFastRender

deploy:
	hugo && hugo deploy

invalidate-cdn:
	gcloud compute url-maps invalidate-cdn-cache collinshoop-com-hugo-lb --path "/*"
```
