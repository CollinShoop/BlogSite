start:
	hugo server -t hello-friend --disableFastRender

deploy:
	hugo && hugo deploy

invalidate-cdn:
	gcloud compute url-maps invalidate-cdn-cache collinshoop-com-hugo-lb --path "/*"
