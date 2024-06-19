const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: config.EMAIL,
        to: email,
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}`
    };

    await transporter.sendMail(mailOptions);
};

const registerUser = async (userData, file) => {
    const { userId, email, password, yearOfBirth, phoneNumber } = userData;
    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(20).toString('hex');

    const newUser = new User({ userId, email, password: hashedPassword, yearOfBirth, phoneNumber, emailVerificationCode: verificationCode });

    if (file) {
        newUser.image = file.filename;
    }

    await newUser.save();
    await sendVerificationEmail(email, verificationCode);

    return newUser;
};

const loginUser = async (login, password) => {
    const user = await User.findOne({ $or: [{ email: login }, { userId: login }, { phoneNumber: login }] });

    if (user && await bcrypt.compare(password, user.password)) {
        if (!user.isEmailVerified) {
            throw new Error('Email not verified');
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET);
        return { token };
    } else {
        throw new Error('Invalid credentials');
    }
};

const verifyEmail = async (email, verificationCode) => {
    const user = await User.findOne({ email });

    if (user && user.emailVerificationCode === verificationCode) {
        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        await user.save();
        return { message: 'Email verified successfully' };
    } else {
        throw new Error('Invalid verification code');
    }
};

const resetPassword = async (email, newPassword) => {
    const user = await User.findOne({ email });

    if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return { message: 'Password reset successfully' };
    } else {
        throw new Error('User not found');
    }
};

module.exports = { registerUser, loginUser, verifyEmail, resetPassword };
