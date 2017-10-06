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
  mailOptions.html = `Beste ${displayName || ''}, <br/><br/>

Bedankt voor uw interesse in QNH. Bijgaand vindt u de opgevraagde documenten. <br/>
Mocht u naar aanleiding hiervan vragen hebben, schroom dan niet <a href="https://www.qnh.eu/contact">contact</a> met ons op te nemen! <br/><br/>
  
Met vriendelijke groet, <br/><br/>

<strong>QNH Consulting BV</strong><br/>
Hogehilweg 24<br/>
1101 CD Amsterdam<br/>
T:  +31 (0)20 46 09 609<br/>
M: +31 (0)65 4214 678<br/>
<a color="#CC3399" href="https://www.qnh.eu">www.qnh.eu</a>`;

  mailOptions.attachments = attachments
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Email sent to:', email);
  });
}
