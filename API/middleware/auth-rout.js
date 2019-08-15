const jwt = require("jsonwebtoken");

var authenticate = (req,res,next)=>{
    var token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY,(err,decode)=>{
        if(err){
            res.json({
                message: "Unathorized access"
            })
        }
        req.user = decode;
        next();
    })
    
}

module.exports = authenticate;