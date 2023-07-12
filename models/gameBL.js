const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const User = require('../models/userModel');

const bottlesInfo = [
    {id: 'whiskey',
     name: 'whiskey',
     price: '20',},
     {id: 'wine',
     name: 'wine',
     price: '20',},
     {id: 'beer',
     name: 'beer',
     price: '40',
     owned: false,},
     {id: 'cola',
     name: 'cola',
     price: '50',},
     {id: 'champagne',
     name: 'champagne',
     price: '80',},
     {id: 'genieBottle',
     name: 'genie lamp',
     price: '100',},
     {id: 'brokenBottle',
     name: 'broken bottle',
     price: '100',},
     {
      id: 'lostBottle',
     name: 'lost bottle',
     price: '100',},
     {
      id: 'loveBottle',
     name: 'love bottle',
     price: '150',}
  ];
  const powerupsInfo = [{id: 'bottleFlip', // 1
  name: 'bottle flip',
  price: '3',},
  {id: 'superShots', // 2
  name: 'super shots',
  price: '3',},
  {id: 'shield', // 3
  name: 'shield',
  price: '3',},
];

exports.buyItem = async function (user, itemID, newBottleData){
    if(newBottleData.name == 'bottle flip' || newBottleData.name == 'super shots' || newBottleData.name == 'shield' ){
        const matchingPowerup = powerupsInfo.find((powerup) => powerup.name === itemID);
        if (!matchingPowerup) {
            throw new Error('couldnt find powerup with matching id');
          };
          if(user.coins < matchingPowerup.price){
            throw new Error('not enough coins to complete the purchase');
          };
          const matchingPowerupUserInfo = user.userPowerups.find((powerup) => powerup.name === itemID);
          if (matchingPowerupUserInfo) {
            matchingPowerupUserInfo.owned++;
            user.coins = user.coins - matchingPowerup.price;
          } else {
            throw new Error('powerup not found in user data');
          }

    } else {
        const matchingBottle = bottlesInfo.find((bottle) => bottle.name === itemID);
        if (!matchingBottle) {
            throw new Error('couldnt find bottle with matching id');
          };
          if(user.coins < matchingBottle.price){
            throw new Error('not enough coins to complete the purchase');
          };
          const matchingBottleUserInfo = user.bottlesOwned.find((bottle) => bottle.name === itemID);
    
          if (matchingBottleUserInfo) {
            matchingBottleUserInfo.owned = true;
          } else {
            user.bottlesOwned.push(newBottleData);
            user.coins = user.coins - matchingBottle.price;
          }
    }
      await user.save();
      return `Congratulations! You have successfully purchased ${itemID}.`;
}
exports.saveLoadout = async function ( user, newData){
    user.bottleSelected = newData.bottleSelected;
    user.userPowerups[0].active = newData.bottleFlipActive;
    user.userPowerups[1].active = newData.superShotsActive;
    user.userPowerups[2].active = newData.shieldActive;

    await user.save();
    return `Congratulations! You have successfully saved loadout data.`;
}
exports.claimMissionReward = async function ( user, completedMissionText){
    const matchingMission = user.userMissions.find((mission) => mission.missionText === completedMissionText);
    if(matchingMission.status == 'completed'){
        throw new Error('mission reward was already claimed');
    }
    matchingMission.status = 'completed';
    user.coins = user.coins + matchingMission.prize;

    await user.save();
    return `Congratulations! You have successfully saved loadout data.`;
}
exports.gameOverUpdate = async function ( user, gameOverData){
  console.log(user)
  user.gamesPlayed++;
  user.totalShots = user.totalShots + gameOverData.totalShots;
  user.totalHits = user.totalHits + gameOverData.totalHits;
  user.coins = user.coins + gameOverData.coins;
  if(user.bossKilled == false){
    user.bossKilled = gameOverData.bossKilled;
  };
  if(gameOverData.usedBottleFlip){
    user.userPowerups[0].owned--;
  }
  if(gameOverData.usedSuperShots){
    user.userPowerups[1].owned--;
  }
  if(gameOverData.usedShield){
    user.userPowerups[2].owned--;
  }
  if(gameOverData.score > user.highScore){
    user.highScore = gameOverData.score;
  }

  await user.save();
  return `Congratulations! You have successfully saved game over data.`;
}