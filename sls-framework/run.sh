# install serverless framework
npm install -g serverless

# sls initializing (creating initial project)
sls

# deploy first time
sls deploy

# invoke on AWS
sls invoke -f hello

# invoke locally
sls invoke local -f hello --verbose

# configure dashboard
sls

# see logs
sls logs -f hello -t

# remove resources
sls remove