const axios = require("axios");
const nodemailer = require('nodemailer');
const serviceUser = require('./serviceUser');
const throwError = require('../utilities/throwError');
const statusCode = require('../utilities/statusCodes');
const messagesManager = require('../utilities/messagesManager');
const { FeedbackUser, FeedbackNoUser } = require('../utilities/emailContent');

async function SendMail(subject, body) {
  // const emails = ["dhirajkarangale02@gmail.com", "vsjoshi772@gmail.com"];
  const emails = ["dhirajkarangale02@gmail.com"];

  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "DK", email: process.env.Email },
        to: emails.map(email => ({ email })),
        subject: subject,
        htmlContent: body
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    return messagesManager.Success("feedbackSubmit");
  } catch (err) {
    console.log("Brevo error:", err.response?.data || err.message);
    throw throwError(messagesManager.Error("feedbackFail"), statusCode.SERVICE_UNAVAILABLE);
  }
}

async function sendFeedback(body) {
  const { userId, feedback } = body;
  const user = userId ? await serviceUser.GetUser(userId) : null;
  const { subject, body: mailBody } = user ? FeedbackUser(feedback, user.id, user.username, user.email) : FeedbackNoUser(feedback);
  return await SendMail(subject, mailBody);
}

module.exports = { sendFeedback };