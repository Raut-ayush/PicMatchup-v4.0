const User = require('../models/User');

const deleteUserByEmail = async (email) => {
    try {
        const result = await User.deleteOne({ email });
        if (result.deletedCount === 0) {
            throw new Error('User not found');
        }
        return { message: 'User deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
};

module.exports = { deleteUserByEmail };
