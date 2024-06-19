require('dotenv').config();
const nodemailer = require('nodemailer');
const config = require('./config');

// Debugging logs to check if environment variables are loaded correctly
console.log('Email:', config.EMAIL);
console.log('Email Password:', config.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASSWORD
    }
});

const mailOptions = {
    from: config.EMAIL,
    to: 'rautayush61@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
