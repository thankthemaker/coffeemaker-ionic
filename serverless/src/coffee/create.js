'use strict';
var AWS = require("aws-sdk");
var https = require('https');

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));
        
        if (record.eventName == 'INSERT') {
            var who = record.dynamodb.NewImage.payload.M.cardid.S;
            var what = record.dynamodb.NewImage.payload.M.product.S;
            var howmuch = record.dynamodb.NewImage.payload.M.price.N;
            callIFTTT(who, what, howmuch, 
              function (status) { console.log('IFTTT-status:' + status); }
            );
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};   

function callIFTTT(who, what, price, completedCallback) {

 var messageString = '';
 
    // Options and headers for the HTTP request   
    var options = {
        host: 'maker.ifttt.com',
        port: 443,
        path: '/trigger/coffee/with/key/c7UrZWUFfF7xqQyGaov3re?value1=' + who 
                + '&value2=' + what + '&value3=' + price,
        method: 'POST',
        headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                 }
    };
    
    // Setup the HTTP request
    var req = https.request(options, function (res) {

        res.setEncoding('utf-8');
              
        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });
        
        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('IFTTT Response: ' + responseString);
            completedCallback('API request sent successfully.');
        });
    });
    
    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
        completedCallback('API request completed with error(s).');
    });
    
    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    console.log('IFTTT API called: ' + messageString);
    req.write(messageString);
    req.end();

}