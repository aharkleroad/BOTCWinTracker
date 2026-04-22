const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // runs middleware between when the request is made to the url and when their request is fulfilled
    // called in order from left to right
    app.get('/getGames', mid.requiresLogin, controllers.Games.getGames);
    app.get('/getAccountType', mid.requiresLogin, controllers.Account.getAccountType);
    
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/settings', mid.requiresLogin, controllers.Account.accountSettings);
    app.post('/settings', mid.requiresLogin, controllers.Account.changeAccountStatus);

    app.get('/maker', mid.requiresLogin, controllers.Games.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Games.makeGame);
    
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;