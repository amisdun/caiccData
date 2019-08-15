const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.router(); 
mongoose.Promise = global.Promise;
//connecting to the database
const url = "mongodb://localhost/caiccDB";
const db = mongoose.connect(url);
db.connection;

const membersDetalis = require("../../CAICC_models/members_model");
const admin = require("../../CAICC_models/admin_model");
const authenticate = require("../middleware/auth-rout");

router.get("/membersData" , authenticate ,(req,res,next) => {
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

router.post("/",(req,res,next) => {
    var details = {
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
    }
    var phone = {
        contactDetails: {
            phoneNumber: req.body.phoneNum,
            emailAddress: req.body.email
        }
    }
    membersDetalis.findOne({phone})
    .exec()
    .then(fone =>{
        if(fone.length === 1){
            res.json({
                message: "you have already registered as a member of CAICC"
            })
        }
        else{
            var new_member = new membersDetalis({details});
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
    var signupDetails = {
        userName: req.body.username,
    };
    admin.findOne({signupDetails})
    .exec()
    .then(user => {
        if(user.length === 1){
            res.json({
                message: "username already exist"
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err,hash) =>{
                if(err){
                    res.json({
                        error: err
                    })
                }
                else{
                    var users = new admin({
                        _id: new mongoose.Types.ObjectId,
                        userName: req.body.username,
                        password: hash
                    })
                    users.save()
                    .then(result => {
                        res.json({
                            result: "admin account created successfuly"
                        })
                    })
                    .catch(err =>{
                        res.json({
                            error: err
                        })
                    })
                }
            })
        }
    })
    .catch(err => {
        res.json({
            error: err
        })
    })
})

// admin login router
router.post("/login", (req,res,next) =>{
    var adm = {
        userName: req.body.username
    }
    admin.findOne({adm})
    .exec()
    .then(results => {
        if(results.length < 1){
            res.json({
                message: "invalid username or password"
            })
        }
        else{
            bcrypt.compare(req.body.password, results.password, (err,valid)=>{
                if(err){
                    res.json({
                        message: "Authentication failed"
                    })
                }
                else if(valid === true){
                    jwt.sign({
                        userName: results.userName,
                        userId: results._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
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
            error: err
        })
    })
})
module.exports = router;