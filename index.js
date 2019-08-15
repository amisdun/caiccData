const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const admin_router = require("./API/CAICC_routers/members_routers");




app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/admin", admin_router);

module.exports = app;
