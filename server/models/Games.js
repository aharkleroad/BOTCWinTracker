const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    script: {
        type: String,
        required: true,
    },
    goodStartAlignment: {
        type: Boolean,
        required: true,
    },
    goodEndAlignment: {
        type: Boolean,
        required: true,
    },
    characterType: {
        type: String,
        required: true,
    },
    characterRole: {
        type: String,
        required: true,
    },
    alignmentSwaps: {
        type: Number,
        required: true,
    },
    roleSwaps: {
        type: Number,
        required: true,
    },
    won: {
        type: Boolean,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    playedDate: {
        type: Date,
        default: Date.now,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

GameSchema.statics.toAPI = (doc) => ({
    
});

const GameModel = mongoose.model('Game', GameSchema);
module.exports = GameModel;