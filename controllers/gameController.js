const { response } = require('express');
const express = require('express');
const appRouter = express.Router();
const jwt = require('jsonwebtoken');
const gameBL = require('../models/gameBL');
require('dotenv').config(); // Load environment variables from .env file
const User = require('../models/userModel');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let user;
        try {
            user = await User.findOne({ _id: decoded._id });
        } catch (e) {
            console.error('Error when finding user:', e);
            throw e;
        }

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}

appRouter.post('/buyitem', auth, async (req, res) => {
        try {
            const itemID = req.body.itemID;
            const newBottleData = req.body.newBottleData;
            await gameBL.buyItem(req.user, itemID, newBottleData);
            
            res.status(200).send({ message: 'Purchase successful' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});
appRouter.post('/saveloadout', auth, async (req, res) => {
    try {
        const newData = req.body.newData;
        await gameBL.saveLoadout(req.user, newData);
        
        res.status(200).send({ message: 'save loadout data successful' });
} catch (error) {
    res.status(400).send({ error: error.message });
}
});
appRouter.post('/missionreward', auth, async (req, res) => {
    try {
        const missionText = req.body.theMissionText;
        await gameBL.claimMissionReward(req.user, missionText);
        
        res.status(200).send({ message: 'claim mission reward successful' });
} catch (error) {
    res.status(400).send({ error: error.message });
}
});
appRouter.post('/gameover', auth, async (req, res) => {
    try {
        const gameOverData = req.body.gameOverData;
        await gameBL.gameOverUpdate(req.user, gameOverData);
        
        res.status(200).send({ message: 'game over function ran succesfully' }); 
} catch (error) {
    res.status(400).send({ error: error.message });
}
});
module.exports = appRouter;