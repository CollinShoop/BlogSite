.PHONY: start deploy hugo-deploy invalidate-cdn

GOOGLE_LB_ID=collinshoop-com-hugo-lb

start:
	hugo server -w

deploy: index-content hugo-deploy invalidate-cdn

index-content:
	./grunt/lunr-index.sh

hugo-deploy:
	hugo && hugo deploy

invalidate-cdn:
	gcloud compute url-maps invalidate-cdn-cache $(GOOGLE_LB_ID) --path "/*"
