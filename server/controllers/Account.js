const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

const accountSettings = (req, res) => {
    return res.render('settings');
}

const friendPage = (req, res) => {
    return res.render('friends');
};

const statsPage = (req, res) => {
    return res.render('stats');
};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }
        req.session.account = Account.toAPI(account);
        return res.json({ redirect: '/maker' });
    });
};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();

        req.session.account = Account.toAPI(newAccount);

        return res.json({ redirect: '/maker' });
    }
    catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }
        return res.status(500).json({ error: 'An error occured!' });
    }
};

const getAccountStats = async (req, res) => {
    try {
        const query = { _id: req.session.account._id };
        const docs = await Account.find(query).select('wins goodGames characters totalGames charSwaps alignmentChanges').lean().exec();
        console.log(docs);
        return res.json({ stats: docs });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving account stats!' })
    }
}

const setAccountStats = async (req, res) => {
    // try {
    //     const query = { _id: req.session.account._id };
    //     const docs = await Account.find(query).select('premiumMember').lean().exec();
    //     console.log(docs);
    //     return res.json({ premiumMember: docs });
    // }
    // catch (err) {
    //     console.log(err);
    //     return res.status(500).json({ error: 'Error retrieving account status!' })
    // }
}

const getAccountType = async (req, res) => {
    try {
        const query = { _id: req.session.account._id };
        const docs = await Account.find(query).select('premiumMember').lean().exec();
        console.log(docs);
        return res.json({ premiumMember: docs });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving account status!' })
    }
}

const changeAccountStatus = async (req, res) => {
    try {
        const query = { _id: req.session.account._id };
        const status = { premiumMember: !req.session.account.premiumMember };
        //console.log(status);
        const docs = await Account.findOneAndUpdate(query, status, {
            returnDocument: 'after'
        }).lean().exec();
        //console.log(docs);
        req.session.account = Account.toAPI(docs);
        //console.log(req.session.account);
        return res.json({ account: docs });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error changing account status!' });
    }
};

const addFriend = async (req, res) => {
    try {
        const query = { username: req.body.username };
        const docs = await Account.find(query).lean().exec();
        console.log(docs);
        return res.json({ friends: docs });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving friend account!' });
    }
}

// const resolvePassChange = async (err, account, newPass, username, req, res) => {
//     if (err || !account) {
//         return res.status(401).json({ error: 'Incorrect password!' });
//     }

//     try {
//         const hash = await Account.generateHash(newPass);
//         const doc = await Account.findOneAndUpdate({ username: username }, { password: hash });

//         return res.status(204);
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(500).json({ error: 'An error occured!' });
//     }
// }

const changeAccountPass = async (req, res) => {
    const username = `${req.session.account.username}`;
    const currentPass = `${req.body.currentPass}`;
    const newPass = `${req.body.newPass}`;
    const newPass2 = `${req.body.newPass2}`;

    if (!currentPass || !newPass || !newPass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (newPass !== newPass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    // finish updating signature
    return Account.setNewPass(username, currentPass, newPass, req, res);
};


module.exports = {
    loginPage,
    logout,
    login,
    signup,
    friendPage,
    statsPage,
    addFriend,
    accountSettings,
    getAccountType,
    getAccountStats,
    setAccountStats,
    changeAccountStatus,
    changeAccountPass,
};