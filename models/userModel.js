const mongoose = require('mongoose');

let appSchema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    userName: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: (value) => {
          // Custom email validation logic (you can use a library like validator.js for more advanced validation)
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email address',
      },
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 0,
    },
    highScore: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    totalShots: {
      type: Number,
      default: 0,
    },
    totalHits: {
      type: Number,
      default: 0,
    },
    bossKilled: {
      type: Boolean,
      default: false,
    },
    demonElliminated: {
      type: Number,
      default: 0,
    },
    witchesElliminated: {
      type: Number,
      default: 0,
    },
    meteorsElliminated: {
      type: Number,
      default: 0,
    },
    bottleFlipKeyBind: String,
    superShotsKeyBind: String,
    shieldKeyBind: String,
    resolutionPicked: String,
    bottlesOwned: [
      {
        name: String,
        src: String,
        shotSrc: String,
        realSrc: String,
      }
    ],
    bottleSelected: String,
    userPowerups: [
      {
        name: String,
        src: String,
        owned: Number,
        hotkey: String,
        active: Boolean,
      }
    ],
    userMissions: [
      {
        missionText: String,
        prize: Number,
        status: String,
      }
    ],
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;