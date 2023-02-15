const uuid = require('uuid');
const Joi = require('@hapi/joi');
const decoratorValidator = require('./util/decoratorValidator');
const globalEmum = require('./util/globalEnum');

class Handler {
  constructor({ dynamoDbSvc }) {
    this.dynamoDbSvc = dynamoDbSvc;
    this.dynamoDbTable = process.env.DYNAMODB_TABLE;
  }

  static validator() {
    return Joi.object({
      name: Joi.string().max(100).min(2).required(),
      power: Joi.string().max(20).required()
    });
  }

  async insertItem(params) {
    return await this.dynamoDbSvc.put(params).promise();
  }

  prepareData(data) {
    const params = {
      TableName: this.dynamoDbTable,
      Item: {
        ...data,
        id: uuid.v1(),
        createdAt: new Date().toISOString()
      }
    }
    return params;
  }

  handlerSuccess(data) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(data)
    }
    return response;
  }

  handlerError(data) {
    const response = {
      statusCode: data.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: `Couldn't create item!!`
    }
    return response;
  }

  async main(event) {
    try {
      // decorator modifies the body to JSON format
      const data = event.body;

      const dbParams = this.prepareData(data);
      await this.insertItem(dbParams);
      return this.handlerSuccess(dbParams.Item);
    } catch (error) {
      console.error('Something went wrong**', error.stack);
      return this.handlerError({ statusCode: 500 });
    }
  }
}

// factory
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const handler = new Handler({
  dynamoDbSvc: dynamoDB
});
module.exports = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  globalEmum.ARG_TYPE.BODY);