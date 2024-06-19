const resetService = require('../services/resetService');

exports.resetState = async (req, res) => {
    console.log('Received request to reset state');
    try {
        const result = await resetService.resetState();
        console.log('State reset successfully');
        res.json(result);
    } catch (error) {
        console.error('Error resetting state:', error);
        res.status(500).json({ error: 'Failed to reset choices' });
    }
};

exports.resetElo = async (req, res) => {
    console.log('Received request to reset ELO scores');
    try {
        const result = await resetService.resetElo();
        console.log('ELO scores reset successfully');
        res.json(result);
    } catch (error) {
        console.error('Error resetting ELO scores:', error);
        res.status(500).json({ error: 'Failed to reset ELO scores' });
    }
};
