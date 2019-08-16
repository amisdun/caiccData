const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router(); 
mongoose.Promise = global.Promise;
//connecting to the database
const url = "mongodb://localhost/myDb";
mongoose.connect(url);
mongoose.connection.once("open",function(){
    console.log("database connected succefully")
}).on("error",function(){
    console.log("an error occured")
})
const membersDetalis = require("../../CAICC_models/members_model");
const admin = require("../../CAICC_models/admin_model");
const authenticate = require("../middleware/auth-rout");
require("../../index");

router.get("/admin", authenticate ,(req,res,next) => {
    membersDetalis.find({})
    .exec()
    .then(members =>{
        if(members.length >= 1){
            res.json({
                response: "success",
                message: members.length + " persons have registered as members of CAICC",
                caicc_members: members
            })
        }
        else{
            res.json({
                message: "no persons have registered!!"
            })
        }
    })
    .catch(err =>{
        res.json({
            error: err
        })
    });
})

router.post("/membersData",(req,res,next) => {
   var details = membersDetalis.find({"contactDetails.phoneNumber":req.body.phoneNum});
    details.exec()
    .then(detail =>{
        if(detail.length >= 1){
            res.json({
                message: "you have already registered as a member of CAICC",
            })
            console.log(detail);
        }
        else{
            var new_member = new membersDetalis({
                            _id: new mongoose.Types.ObjectId,
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    age: req.body.age,
                    occupation: req.body.occupation,
                    contactDetails: {
                        phoneNumber: req.body.phoneNum,
                        emailAddress: req.body.email
                    },
                    houseAddress: req.body.houseaddress,
                    gender: req.body.gender
                        });
            new_member
            .save()
            .then(detail =>{
                res.json({
                    message: "you have succesfull registered as a member of CAICC"
                })
            })
            .catch(err =>{
                res.json({
                    error: err
                })
            })
        }
    })
    .catch(err =>{
        res.json({
            error: err
        })
    })
})
//admin sighn up router
router.post("/signup",(req,res,next) =>{
    admin.find({userName: req.body.username})
    .exec()
    .then(users => {
        if(users.length >= 1){
            res.status(409).json({
                message: "username already exist"
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err,hash) =>{
                if(err){
                    res.status(500).json({
                        error: "could not hash password"
                    })
                }
                else{
                     new admin({
                        _id: new mongoose.Types.ObjectId,
                        userName: req.body.username,
                        password: hash
                    })
                    .save()
                    .then(result => {
                        res.status(200).json({
                            result: "admin account created successfuly"
                        })
                    })
                    .catch(err =>{
                        res.status(500).json({
                            error: "account has not been created, an error has occured"
                        })
                    })
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: "an error occured, try again"
        })
    })
})

// admin login router
router.post("/login", (req,res,next) =>{
    admin.find({userName: req.body.username})
    .exec()
    .then(results => {
        if(results.length < 1){
            res.json({
                message: "invalid username or password"
            })
        }
        else{
            console.log(results[0].password);
            bcrypt.compare(req.body.password, results[0].password, (err,valid)=>{
                console.log(results.password);
                if(err){
                    res.json({
                        message: "an error occured"
                    })
                }
                else if(valid === true){
                    var token =jwt.sign({
                        userName: results.userName,
                        userId: results._id
                    },
                    "dbkdbkqrjgrvgcwtkrnhrigukbqk",
                    {
                        expiresIn: "24h"
                    });
                    res.json({
                        message:  "Authentication succesfull",
                        token: token
                    })
                }
                else{
                    res.json({
                        message: "Authentication failed"
                    })
                }
            })
        }
    })
    .catch(err =>{
        res.json({
            error: "an error occured"
        })
    })
})
module.exports = router;