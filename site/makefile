.PHONY: start deploy hugo-deploy invalidate-cdn

GOOGLE_LB_ID=collinshoop-com-hugo-lb

# Start hugo server locally for testing http://localhost:1313
local:
	hugo server -w

deploy: pull-github-content index-content hugo-deploy

pull-github-content:
	cd ../script/gh && make pull

index:
	./grunt/lunr-index.sh

hugo-deploy:
	hugo && hugo deploy

# Optional after deploy
invalidate-cdn:
	gcloud compute url-maps invalidate-cdn-cache $(GOOGLE_LB_ID) --path "/*"
