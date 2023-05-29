# Deployment

## Dependencies

1. [Hugo CLI](https://gohugo.io/installation/)
1. [GitHub CLI](https://cli.github.com/)
1. [GCloud CLI](https://cloud.google.com/sdk/docs/install)

## Update Content

### Github

Steps to pull data from GitHub

1. Change working directory to `script/gh`
1. Run `make login`
1. Run `make pull` -- This will update `script/gh/gists.json` and `script/gh/prs.json`

### Lunr

Steps to update the Lunr search index which powers the search feature

1. Change working directory to `site/`
1. run `make index` -- This updates `site/static/js/lunr/index.json` which is read to populate search results

## Run local

Steps to host the website locally. Be sure to update content first! 

1. change directory to `site/`
1. Start locally with `make local`
1. Connect to http://localhost:1313

## Useful Links

- [Hugo: Deploying as a static site](https://gohugo.io/hosting-and-deployment/hugo-deploy/)
- [Google Cloud: Hosting a static website](https://cloud.google.com/storage/docs/hosting-static-website)

and some others which may or may not be useful to others putting together a similar project

- [Digital Ocean: How to build and deploy a hugo site to DigitalOcean App Platform](https://www.digitalocean.com/community/tutorials/how-to-build-and-deploy-a-hugo-site-to-digitalocean-app-platform)