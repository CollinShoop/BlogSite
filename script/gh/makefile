
# https://docs.github.com/en/rest/quickstart
login:
	gh auth login

pull: gists prs

# https://docs.github.com/en/rest/gists/gists#list-gists-for-the-authenticated-user
.SILENT:
gists:
	gh api \
      -H "Accept: application/vnd.github+json" \
      /gists > gists.json

.SILENT:
prs:
	gh search prs --author=@me --merged --json title,url,createdAt,updatedAt,repository > prs.json
