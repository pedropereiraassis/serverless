'use strict';
const settings = require('./config/settings');
const axios = require('axios');
const cheerio = require('cheerio');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

class Handler {
  static async main(event) {
    console.log('at', new Date().toISOString(), JSON.stringify(event, null, 2));
    const { data } = await axios.get(settings.commitMessageURL);
    const $ = cheerio.load(data);
    const [commitMessage] = $("#content").text().trim().split('\n');
    
    const params = {
      TableName: settings.dbTableName,
      Item: {
        commitMessage,
        id: uuid.v1(),
        createdAt: new Date().toISOString()
      }
    }

    await dynamoDb.put(params).promise();

    return {
      statusCode: 200
    }
  }
}

module.exports = {
  scheduler: Handler.main
}