const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        const newUser = await authService.registerUser(req.body, req.file);
        res.status(201).send('User registered. Verification email sent.');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { token } = await authService.loginUser(req.body.login, req.body.password);
        res.json({ token });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const result = await authService.verifyEmail(req.body.email, req.body.verificationCode);
        res.status(200).send(result.message);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const result = await authService.resetPassword(req.body.email, req.body.newPassword);
        res.status(200).send(result.message);
    } catch (error) {
        res.status(400).send(error.message);
    }
};
