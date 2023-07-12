const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const User = require('../models/userModel');

exports.register = async function(userObj) {
    try {
        const userName = userObj.userName;
        const password = userObj.password;
        const email = userObj.email;
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save the user details to the database

      const user = await User.create({
        userName: userName,
        password: hashedPassword,
        email: email,
        dateCreated: new Date(),
        isGuest: false,
        gamesPlayed: 0,
        coins: 0,
        highScore: 0,
        accuracy: 0,
        totalShots: 0,
        totalHits: 0,
        bossKilled: false,
        demonElliminated: 0,
        witchesElliminated: 0,
        meteorsElliminated: 0,
        bottleFlipKeyBind: 'z',
        superShotsKeyBind: 'x',
        shieldKeyBind: 'c',
        resolutionPicked: 'high',
        bottlesOwned: [
          {
            name: 'default',
            src: 'https://i.imgur.com/Dt3jvqV.png',
            shotSrc: 'https://i.imgur.com/HfRYTkp.png',
            realSrc: 'https://i.imgur.com/Og88sMT.png',
          },
        ],
        bottleSelected: 'default',
        userPowerups: [
          {
            name: 'bottle flip',
            src: 'https://i.ibb.co/VY18z1P/Mask-group-1.png',
            owned: 0,
            hotkey: 'z',
            active: false,
          },
          {
            name: 'super shots',
            src: 'https://i.ibb.co/sQjMKLT/Group-22-2.png',
            owned: 0,
            hotkey: 'x',
            active: false,
          },
          {
            name: 'shield',
            src: 'https://i.ibb.co/C2F7c5g/Group-22-3.png',
            owned: 0,
            hotkey: 'c',
            active: false,
          },
        ],
        userMissions: [
                         {missionText: 'reach 500 score', prize: 5, status: 'in progress'},
                         {missionText: 'reach 2500 score', prize: 25, status: 'in progress'},
                         {missionText: 'reach 5000 score', prize: 50, status: 'in progress'},
                         {missionText: 'reach 10000 score', prize: 80, status: 'in progress'},
                         {missionText: 'reach 20000 score', prize: 80, status: 'in progress'},
                         {missionText: 'use bottle flip powerup', prize: 5, status: 'in progress'},
                         {missionText: 'use super shots powerup', prize: 5, status: 'in progress'},
                         {missionText: 'use shield powerup', prize: 5, status: 'in progress'},
                         {missionText: 'eliminate the boss', prize: 30, status: 'in progress'},
                         {missionText: 'eliminate 20 enemies in 1 game', prize: 5, status: 'in progress'},
                         {missionText: 'eliminate 50 enemies in 1 game', prize: 10, status: 'in progress'},
                         {missionText: 'eliminate 100 enemies in 1 game', prize: 20, status: 'in progress'},
                         {missionText: '100 hits in a single game', prize: 5, status: 'in progress'},
                         {missionText: '250 hits in a single game', prize: 10, status: 'in progress'},
                         {missionText: '500 hits in a single game', prize: 20, status: 'in progress'},
                         {missionText: 'get 5 coins in 1 game', prize: 15, status: 'in progress'}
        ]
      });
      const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);

      const userResponse = {
        userName: user.userName,
        email: user.email,
        isGuest: false,
        gamesPlayed: 0,
        coins: 0,
        highScore: 0,
        accuracy: 0,
        totalShots: 0,
        totalHits: 0,
        bossKilled: false,
        demonElliminated: 0,
        witchesElliminated: 0,
        meteorsElliminated: 0,
        bottleFlipKeyBind: 'z',
        superShotsKeyBind: 'x',
        shieldKeyBind: 'c',
        resolutionPicked: 'high',
        bottlesOwned: [
          {
            name: 'default',
            src: 'https://i.imgur.com/Dt3jvqV.png',
            shotSrc: 'https://i.imgur.com/HfRYTkp.png',
            realSrc: 'https://i.imgur.com/Og88sMT.png',
          },
        ],
        bottleSelected: 'default',
        userPowerups: [
          {
            name: 'bottle flip',
            src: 'https://i.ibb.co/VY18z1P/Mask-group-1.png',
            owned: 0,
            hotkey: 'z',
            active: false,
          },
          {
            name: 'super shots',
            src: 'https://i.ibb.co/sQjMKLT/Group-22-2.png',
            owned: 0,
            hotkey: 'x',
            active: false,
          },
          {
            name: 'shield',
            src: 'https://i.ibb.co/C2F7c5g/Group-22-3.png',
            owned: 0,
            hotkey: 'c',
            active: false,
          },
        ],
        userMissions: [
                         {missionText: 'reach 500 score', prize: 5, status: 'in progress'},
                         {missionText: 'reach 2500 score', prize: 25, status: 'in progress'},
                         {missionText: 'reach 5000 score', prize: 50, status: 'in progress'},
                         {missionText: 'reach 10000 score', prize: 80, status: 'in progress'},
                         {missionText: 'reach 20000 score', prize: 80, status: 'in progress'},
                         {missionText: 'use bottle flip powerup', prize: 5, status: 'in progress'},
                         {missionText: 'use super shots powerup', prize: 5, status: 'in progress'},
                         {missionText: 'use shield powerup', prize: 5, status: 'in progress'},
                         {missionText: 'eliminate the boss', prize: 30, status: 'in progress'},
                         {missionText: 'eliminate 20 enemies in 1 game', prize: 5, status: 'in progress'},
                         {missionText: 'eliminate 50 enemies in 1 game', prize: 10, status: 'in progress'},
                         {missionText: 'eliminate 100 enemies in 1 game', prize: 20, status: 'in progress'},
                         {missionText: '100 hits in a single game', prize: 5, status: 'in progress'},
                         {missionText: '250 hits in a single game', prize: 10, status: 'in progress'},
                         {missionText: '500 hits in a single game', prize: 20, status: 'in progress'},
                         {missionText: 'get 5 coins in 1 game', prize: 15, status: 'in progress'}
        ],
        token,
      };

      return {
        success: true,
        message: 'User registered successfully',
        user: userResponse
         };
        }  catch (error) {
            console.error(error);
        // Check if the error is a duplicate key error
        if (error.code === 11000) {
          // Extract the duplicate field from the error message
          const duplicateField = Object.keys(error.keyValue)[0];
      
          if (duplicateField === 'userName') {
            throw new Error('Username already exists');
          } else if (duplicateField === 'email') {
            throw new Error('Email address is already registered');
          }
        }
      
        // Handle other errors
        throw new Error('Failed to register user');
      }
  };

  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  exports.login = async function(userObj) {
    let input = userObj.input;
    const password = userObj.password;
    // Determining whether input is email or username
    let user;
    if(emailRegex.test(input)) {
        // The input is an email, so search the database for it
        user = await User.findOne({ email: input });
    } else {
        // The input is a username, so search the database for it
        user = await User.findOne({ userName: input });
    }

    // If the user doesn't exist, throw an error
    if (!user) {
        throw new Error('user not found');
    }

    // Check if the provided password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('password is incorrect');
    }

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);

    // If everything is correct, return the user data
    const userResponse = {
        userName: user.userName,
        email: user.email,
        isGuest: false,
        gamesPlayed: user.gamesPlayed,
        coins: user.coins,
        highScore: user.highScore,
        accuracy: user.accuracy,
        totalShots: user.totalShots,
        totalHits: user.totalHits,
        bossKilled: user.bossKilled,
        demonElliminated: user.demonElliminated,
        witchesElliminated: user.witchesElliminated,
        meteorsElliminated: user.meteorsElliminated,
        bottleFlipKeyBind: user.bottleFlipKeyBind,
        superShotsKeyBind: user.superShotsKeyBind,
        shieldKeyBind: user.shieldKeyBind,
        resolutionPicked: user.resolutionPicked,
        bottlesOwned: user.bottlesOwned,
        bottleSelected: user.bottleSelected,
        userPowerups: user.userPowerups,
        userMissions: user.userMissions,
        token,
      };
      return {
        success: true,
        message: 'User logged in successfully',
        user: userResponse
         };
}