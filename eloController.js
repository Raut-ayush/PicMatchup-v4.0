const { getEloRatings } = require('../services/eloService');

exports.getEloRatings = async (req, res) => {
    try {
        const eloList = await getEloRatings();
        res.json(eloList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ELO ratings' });
    }
};
