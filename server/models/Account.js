const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  friends: {
    type: Array,
    default: [],
  },
  wins: {
    type: Array,
    default: {trouble: 0, sects: 0, moon: 0, other: 0},
  },
  goodGames: {
    type: Array,
    default: {trouble: 0, sects: 0, moon: 0, other: 0},
  },
  characters: {
    type: Object,
    default: {good: [], evil: []},
  },
  totalGames: {
    type: Array,
    default: {trouble: 0, sects: 0, moon: 0, other: 0},
  },
  charSwaps: {
    type: Number,
    min: 0,
    default: 0,
  },
  alignmentChanges: {
    type: Number,
    min: 0,
    default: 0,
  },
  premiumMember: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  premiumMember: doc.premiumMember,
  _id: doc._id,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// Helper function for authenticating a password against one already in the database
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({username}).exec();
    if(!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
