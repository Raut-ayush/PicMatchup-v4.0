// services/mailService.js
const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
});

const sendOtp = (email, otp) => {
    const mailOptions = {
        from: config.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };
    
    return transporter.sendMail(mailOptions);
};

module.exports = { sendOtp };
