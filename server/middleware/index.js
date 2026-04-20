// prevents user from navigating to app page if they aren't logged in
// otherwise calls the next function to fulfill their request
const requiresLogin = (req, res, next) => {
    if (!req.session.account){
        return res.redirect('/');
    }
    return next();
}

// prevents user from navigating to signup or login page if they are already logged in
// otherwise calls the next function to fulfill their request
const requiresLogout = (req, res, next) => {
    if (req.session.account){
        return res.redirect('/maker');
    }
    return next();
}

// redirects user to secure https site if making a http/unencrypted request
// otherwise calls the next function to fulfill their request
const requiresSecure = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https'){
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
}

// prevents security check when server running locally
const bypassSecure = (req, res, next) => {
    return next();
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// checks what environment code is running in
if (process.env.NODE_ENV === 'production'){
    module.exports.requiresSecure = requiresSecure;
}
else {
    module.exports.requiresSecure = bypassSecure;
}