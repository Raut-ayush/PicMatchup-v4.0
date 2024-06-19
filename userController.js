const userService = require('../services/userService');

exports.deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await userService.deleteUserByEmail(email);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
