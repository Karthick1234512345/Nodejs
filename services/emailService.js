const nodemailer = require('nodemailer');
const emailTemplates = require('../config/emailTemplates');

const logger = require('./logger');

const sendEmail = async (emailData, event) => {
  let emailBody;
  let emailTitle;
  if (event === 'otp') {
    emailBody = emailTemplates.otp.body;
    emailTitle = emailTemplates.otp.title;
    emailBody = emailBody.replace('{{otp}}', emailData.otp);
    emailBody = emailBody.replace('{{name}}', emailData.name);
  }

  if (event === 'forgotPassword') {
    emailBody = emailTemplates.forgotPassword.body;
    emailTitle = emailTemplates.forgotPassword.title;
    emailBody = emailBody.replace('{{temproaryPassword}}', emailData.temproaryPassword);
    emailBody = emailBody.replace('{{name}}', emailData.name);
  }
  const smtpConfig = {
    service: 'gmail',
    port: 465,
    secure: true,
    secureConnection: false,
    auth: {
      user: 'kkrishnagowda@primesoft.net',
      pass: 'u85Y%ASm',
    },
  };
  const transporter = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    from: 'kkrishnagowda@primesoft.net',
    to: emailData.email,
    subject: emailTitle,
    text: emailBody,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      logger.error(`Error regarding sending email ${error}`);
    } else {
      logger.info(`email sent successfully to ${emailData.email}`);
    }
  });
};
module.exports = { sendEmail };
