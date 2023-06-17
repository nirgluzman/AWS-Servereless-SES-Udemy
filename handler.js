// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/classes/sendemailcommand.html
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const client = new SESClient({});

module.exports.createContact = async (event, context) => {
  console.log('event', event);
  console.log('context', context);

  const { to, from, subject, message } = JSON.parse(event.body);
  if (!to || !from || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing required fields',
      }),
    };
  }

  const input = {
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: message },
      },
    },
  };

  const command = new SendEmailCommand(input);

  try {
    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Email sent successfully',
        success: true,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};
