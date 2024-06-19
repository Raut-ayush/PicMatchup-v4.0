const mongoose = require('mongoose');

const EloSchema = new mongoose.Schema({
    image: { type: String, required: true, unique: true },
    elo: { type: Number, required: true, default: 1200 },
});

module.exports = mongoose.model('Elo', EloSchema);
