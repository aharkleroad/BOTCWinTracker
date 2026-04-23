const models = require('../models');
const Games = models.Games;

const makerPage = (req, res) => {
    return res.render('app');
};

const getGames = async (req, res) => {
    try {
        const query = {owner: req.session.account._id};
        const docs = await Games.find(query).select('script goodStartAlignment characterType characterRole alignmentSwaps roleSwaps playedDate').lean().exec();
        return res.json({games: docs});
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving game info!'})
    }
};

const makeGame = async (req, res) => {
    if (!req.body.script || !req.body.alignStart || !req.body.charType || !req.body.charRole || !req.body.alignSwaps || !req.body.charSwaps || !req.body.won ){
        return res.status(400).json({error: 'All fields are required!'});
    }

    const gameData = {
        script: req.body.script,
        goodStartAlignment: req.body.alignStart,
        characterType: req.body.charType,
        characterRole: req.body.charRole,
        alignmentSwaps: req.body.alignSwaps,
        roleSwaps: req.body.charSwaps,
        won: req.body.won,
        owner: req.session.account._id
    };

    // calculate the players end alignment
    if ((gameData.alignmentSwaps % 2) === 1){
        gameData.goodEndAlignment = !gameData.goodStartAlignment;
    }
    else {
        gameData.goodEndAlignment = gameData.goodStartAlignment;
    }

    // add the date to the data if a played date was provided
    if (req.body.date){
        gameData.date = req.body.date;
    }

    try {
        const newGame = new Games(gameData);
        await newGame.save();
        return res.status(201).json({script: newGame.script,
                                     goodStartAlignment: newGame.goodStartAlignment,
                                     goodEndAlignment: newGame.goodEndAlignment,
                                     characterType: newGame.characterType, 
                                     characterRole: newGame.characterRole, 
                                     alignmentSwaps: newGame.alignmentSwaps, 
                                     roleSwaps: newGame.roleSwaps, 
                                     playedDate: newGame.playedDate,
                                     id: newGame.id, }
                                    );
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({error: 'An error occured creating the game'});
    }
}

module.exports = {makerPage, makeGame, getGames};