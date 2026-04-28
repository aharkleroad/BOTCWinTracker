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
  friends: doc.friends,
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

// Helper function for verifying a password exists and updating it
AccountSchema.statics.setNewPass = async (username, oldPassword, newPassword, req, res) => {
  try {
    const doc = await AccountModel.findOne({username}).exec();
    if(!doc) {
      return res.status(404).json({ error: 'Could not find account!' });
    }

    const match = await bcrypt.compare(oldPassword, doc.password);
    if (match) {
      const hash = await AccountModel.generateHash(newPassword);
      const user = await AccountModel.findOneAndUpdate({ username: username }, { password: hash });

      return res.status(204).json({user});
    }
    return res.status(400).json({error: "Incorrect password"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({error: "An error occurred while changing pasword"});
  }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
