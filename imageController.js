const imageService = require('../services/imageService');
const eloService = require('../services/eloService');

exports.getImages = async (req, res) => {
    try {
        const images = await imageService.getImages();
        res.json({ images });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.recordChoice = async (req, res) => {
    try {
        const { choice, other } = req.body;
        await imageService.recordChoice(choice, other);
        await eloService.updateElo(choice, other);
        res.json({ message: 'Choice recorded and ELO updated' });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
