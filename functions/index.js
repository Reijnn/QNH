const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const APP_NAME = 'QNH Consulting';

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);

const mailTransport = nodemailer.createTransport(
  `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendEmail = functions.database.ref('/clients/{client}').onCreate(event => {

  const user = event.data.val();

  console.log(user)

  const email = user.clientEmail
  const displayName = user.clientName
  var attachments = []

  user.clientPapers.forEach(function (element) {
    var item = {filename: element.fileName, path: element.fileUrl}
    attachments.push(item)
  }, this);

  return sendEmail(email, displayName, attachments);
});

function sendEmail(email, displayName, attachments) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
  mailOptions.attachments = attachments
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Email sent to:', email);
  });
}
