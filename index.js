const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const admin_router = require("./API/CAICC_routers/members_routers");
const port = process.env.PORT || 3000;
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header("Access-Control-Allow-Methods","GET POST PUT PATCH DELETE");
    next();
})
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/members", admin_router);
// app.use(espress.static(""))

app.listen(port, function(){
    console.log("listening to port" + port);
});
module.exports = app;
