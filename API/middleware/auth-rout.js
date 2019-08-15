const jwt = require("jsonwebtoken");

var authenticate = (req,res,next) =>{
    jwt.verify(req.query.token, process.env.JWT_KEY,(err,decode)=>{
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