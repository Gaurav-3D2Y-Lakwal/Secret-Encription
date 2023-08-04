//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

const {Schema}= mongoose;
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

console.log(process.env.API_KEY);

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]}); 


const User = new mongoose.model("User",userSchema);
 

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    run();
    async function run(){
        try{
            const newUser = new User({
                email: req.body.username,
                password: req.body.password
            })
            newUser.save(); 
            res.render("secrets");

        }catch(err){
            console.log(err);
        }
    }
})

app.post("/login",function(req,res){
    run();
    async function run(){
        try{
            const username = req.body.username;
            const password = req.body.password;

            const foundUser = await User.findOne({email:username});

            if(foundUser.password === password){
                res.render("secrets");
            }

        }catch(err){
            console.log(err);
        }
        }
})

app.listen(3000,function(){
    console.log("server is running on port 3000");
});