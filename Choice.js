const mongoose = require('mongoose');

const ChoiceSchema = new mongoose.Schema({
    choice: { type: String, required: true },
    other: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Choice', ChoiceSchema);
