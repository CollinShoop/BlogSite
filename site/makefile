.PHONY: start deploy hugo-deploy invalidate-cdn

GOOGLE_LB_ID=collinshoop-com-hugo-lb

start:
	hugo server -w

deploy: hugo-deploy invalidate-cdn

hugo-deploy:
	hugo && hugo deploy

invalidate-cdn:
	gcloud compute url-maps invalidate-cdn-cache $(GOOGLE_LB_ID) --path "/*"
