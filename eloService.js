const Elo = require('../models/Elo');
const config = require('../config');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache TTL of 10 minutes

const calculateElo = (rating1, rating2, result, kFactor = config.ELO_K_FACTOR) => {
    const expected1 = 1 / (1 + 10 ** ((rating2 - rating1) / 400));
    const expected2 = 1 / (1 + 10 ** ((rating1 - rating2) / 400));
    const newRating1 = rating1 + kFactor * (result - expected1);
    const newRating2 = rating2 + kFactor * ((1 - result) - expected2);
    return [newRating1, newRating2];
};

const updateElo = async (choice, other) => {
    const defaultElo = config.ELO_DEFAULT;

    const choiceEloDoc = await Elo.findOne({ image: choice }) || new Elo({ image: choice, elo: defaultElo });
    const otherEloDoc = await Elo.findOne({ image: other }) || new Elo({ image: other, elo: defaultElo });

    const [newChoiceElo, newOtherElo] = calculateElo(choiceEloDoc.elo, otherEloDoc.elo, 1);

    choiceEloDoc.elo = newChoiceElo;
    otherEloDoc.elo = newOtherElo;

    await choiceEloDoc.save();
    await otherEloDoc.save();

    // Clear cache after updating ELO scores
    cache.del('eloList');
};

const getEloRatings = async () => {
    const cachedEloList = cache.get('eloList');
    if (cachedEloList) {
        return cachedEloList;
    }

    const eloList = await Elo.find().sort({ elo: -1 }).exec();
    cache.set('eloList', eloList);
    return eloList;
};

module.exports = { updateElo, getEloRatings };
