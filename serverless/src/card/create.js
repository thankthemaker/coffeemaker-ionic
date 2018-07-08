'use strict'
const AWS = require('aws-sdk')
let doc = new AWS.DynamoDB.DocumentClient()
let cardsTable = process.env.CARDS_TABLE

console.log('Loading function')

exports.handler = function (event, context, callback) {
  console.log('request: ' + JSON.stringify(event))
  handleHttpMethod(event, context)
}

function handleHttpMethod (event, context) {
  let httpMethod = event.httpMethod
  if (event.path.match(/^\/cards/)) {
    if (httpMethod === 'GET') {
      return handleGET(event, context)
    } else if (httpMethod === 'POST') {
      return handlePOST(event, context)
    } else if (httpMethod === 'PUT') {
      return handlePUT(event, context)
    } else if (httpMethod === 'DELETE') {
      return handleDELETE(event, context)
    }
  } 
  return errorResponse(context, 'Unhandled http method:', httpMethod)
}

function handleGET (event, context) {
  let params = {
    TableName: cardsTable,
    KeyConditionExpression: 'userId = :key',
    ExpressionAttributeValues: { ':key': event.requestContext.identity.cognitoIdentityId }
  }

  console.log('GET query: ', JSON.stringify(params))
  doc.query(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: ', err) }
    return successResponse(context, {cards: data.Items})
  })
}

function handlePOST (event, context) {
  let card = JSON.parse(event.body)
  if (!card || !card.cardId) { return errorResponse(context, 'Error: no cardId found') }
  card.userId = event.requestContext.identity.cognitoIdentityId
  let params = { TableName: cardsTable, Item: card }

  console.log('Inserting card', JSON.stringify(card))
  doc.put(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not add card', err.message) }
    successResponse(context, {card: card})
  })
}

function handlePUT (event, context) {
  let card = JSON.parse(event.body)
  let cardId = getCardId(event.path)
  if (!card || !cardId) { return errorResponse(context, 'Error: no cardId found') }
  let params = {
    TableName: cardsTable,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      cardId: cardId
    },
    UpdateExpression: 'set #a = :val1, #b = :val2',
    ExpressionAttributeNames: {'#a': 'completed', '#b': 'completedOn'},
    ExpressionAttributeValues: {':val1': task.completed, ':val2': task.completedOn},
    ReturnValues: 'ALL_NEW'
  }

  console.log('Updating card', JSON.stringify(params))
  doc.update(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not update card', err.message) }
    successResponse(context, {card: data.Attributes})
  })
}

function handleDELETE (event, context) {
  let cardId = getCardId(event.path)
  if (!cardId) { return errorResponse(context, 'Error: no cardId found') }
  let params = {
    TableName: cardsTable,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      cardId: cardId
    },
    ReturnValues: 'ALL_OLD'
  }

  console.log('Deleting card', JSON.stringify(params))
  doc.delete(params, (err, data) => {
    if (err) { return errorResponse(context, 'Error: could not delete card', err.message) }
    successResponse(context, {card: data.Attributes})
  })
}

function getCardId (path) { return path.match(/cards\/(.*)/)[1] }

function errorResponse (context, logline) {
  let response = { statusCode: 404, body: JSON.stringify({ 'Error': 'Could not execute request' }) }
  let args = Array.from(arguments).slice(1)
  console.log.apply(null, args)
  context.succeed(response)
}

function successResponse (context, body) {
  let response = { statusCode: 200, body: JSON.stringify(body), headers: { 'Access-Control-Allow-Origin': '*' } }
  console.log('response: ' + JSON.stringify(response))
  context.succeed(response)
}
