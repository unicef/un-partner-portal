# Deployment / DevOps

Main development branch is `develop`, from it we branch for features / bugfixes and then open Pull Requests \(PRs\) to do code review and verification. 

`Develop` and `master` branches are setup to automatically build and deploy on changes using the following flow:

1. Push to Github
2. Build triggers on codefresh
3. Docker images are built and pushed to dockerhub
4. Deployment is done on kubernetes cluster.

