# API Documentation

We use [Swagger](https://django-rest-swagger.readthedocs.io/en/latest/) to document the API's. To view, simply run **/docs** when running the codebase locally or any environment of UNPP as well.

### Code flow

**Github** - branches develop and master are monitored for all changes \(pushes\) with codefresh hooks

**Codefresh** - after successful push to monitored branch, codefresh starts to build docker images based on new code -&gt; puts some basic tests against new images -&gt; pushes new images to docker hub

**Docker Cloud -** monitors new images on docker hub, get them and deploy accordingly to defined configuration -&gt; application deployed



