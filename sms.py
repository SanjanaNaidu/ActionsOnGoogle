exports.handler = async (event) => {
    // Load the AWS SDK for Node.js
    
   var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var sns = new AWS.SNS();

var params = {
  Message: 'STRING_VALUE', /* required */
  MessageAttributes: {
    '<String>': {
      DataType: 'STRING_VALUE', /* required */
      BinaryValue: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
      StringValue: 'STRING_VALUE'
    },
    /* '<String>': ... */
  },
  MessageStructure: 'STRING_VALUE',
  PhoneNumber: '+918105871092',
  Subject: 'STRING_VALUE',
  TargetArn: '+918105871092',
  TopicArn: '+918105871092'
};
sns.publish(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
};
