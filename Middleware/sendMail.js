const nodemailer = require('nodemailer')

async function sendEmail(email, msg, subject) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.APP_PASSWORD,
        to: email,
        subject: subject,
        text: msg
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    sendEmail
}