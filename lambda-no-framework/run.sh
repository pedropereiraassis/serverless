# 1o create policy.json file and create role
aws iam create-role \
  --role-name lambda-example \
  --assume-role-policy-document file://policy.json \
  | tee logs/role.log

# 2o zipar index.js
# 3o create lambda function
aws lambda create-function \
  --function-name hello-cli \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime nodejs18.x \
  --role arn:aws:iam::623364425356:role/lambda-example \
  | tee logs/lambda-create.log

# 4o invoke lambda
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec.log

# -- update function, zip function
aws lambda update-function-code \
  --zip-file fileb://function.zip \
  --function-name hello-cli \
  --publish \
  | tee logs/lambda-update.log

# invoke and see result
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec-update.log

# remove function and role
aws lambda delete-function \
  --function-name hello-cli

aws iam delete-role \
  --role-name lambda-example