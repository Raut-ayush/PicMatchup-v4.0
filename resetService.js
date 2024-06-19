const Choice = require('../models/Choice');
const Elo = require('../models/Elo');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

const shownPairs = new Set();

const resetState = async () => {
    console.log('Resetting state');
    shownPairs.clear();
    await Choice.deleteMany({});
    console.log('State reset complete');
    return { message: 'State reset' };
};

const resetElo = async () => {
    console.log('Resetting ELO scores');
    await Elo.deleteMany({});
    cache.del('eloList');
    console.log('ELO scores reset complete');
    return { message: 'ELO scores reset' };
};

module.exports = { resetState, resetElo };
