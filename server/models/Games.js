const mongoose = require('mongoose');
const _ = require('underscore');

const GameSchema = new mongoose.Schema({
    script: {
        type: String,
        required: true,
    },
    goodAlignment: {
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
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    playedDate: {
        type: Date,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;