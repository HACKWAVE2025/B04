const nodemailer = require('nodemailer');

// Configure your mail transport here
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
        user: process.env.EMAIL_USER, // set in your environment
        pass: process.env.EMAIL_PASS  // set in your environment
    }
});

/**
 * Sends a contact mail
 * @param {string} fullName
 * @param {string} email
 * @param {string} subject
 * @param {string} message
 * @param {string} profession
 * @param {string} senderIp
 */
async function sendContactMail(fullName, email, subject, message, profession, senderIp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // send to yourself or another address
        subject: `Contact Form: ${subject}`,
        text: `Name: ${fullName}\nEmail: ${email}\nProfession: ${profession}\nMessage: ${message}\nSender IP: ${senderIp}`
    };
    return transporter.sendMail(mailOptions);
}

module.exports = sendContactMail;
