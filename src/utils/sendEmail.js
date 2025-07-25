// sendEmail.js
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>Hello Sarthak!</h1><p>This is a test email from your app. You're almost there 🚀</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Hello Sarthak! This is a test email from your app. You're almost there 🚀`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "🚀 Test Email from realtinder.tech",
      },
    },
    Source: fromAddress, // Must be verified in SES
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "sarthakdhumal95@gmail.com",
    "noreply@realtinder.tech"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (error) {
    console.error("Email send failed: ", error);
    return error;
  }
};

module.exports = { run };
