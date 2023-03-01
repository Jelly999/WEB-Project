// From Erno Gitlab
const jwt = require("jsonwebtoken");
const localStorage = require('localStorage');
const secret = "WEB9"
module.exports = function(req, res, next) {
    //console.log(req.headers)
    //const authHeader = req.headers["authorization"];
    const authHeader = "Bearer " + localStorage.getItem('auth_token')
    console.log("AuthHeader: ",authHeader);
    let token;
    if(authHeader) {
        token = authHeader.split(" ")[1];
    } else {
        token = null;
    }
    if(token == null) return res.sendStatus(401);
    console.log("Token found");
    jwt.verify(token, secret, (err, user) => {
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    });


    
};
