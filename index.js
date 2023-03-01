const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoose = require('mongoose');
const User = require("./Users");
const Snippet = require("./Snippet");
const jwt = require("jsonwebtoken");
const validateToken = require("./validateToken")
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const path = require('path');
const localStorage = require('localStorage');
const jwtDecode = require('jwt-decode');

const mongoDB = "mongodb://0.0.0.0:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB error"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//Get routes
app.get("/login.html", (req, res) => {
  res.render('login');
});

app.get("/logout", (req, res) => {
  //INFO
  localStorage.removeItem('auth_token')
  res.redirect('/');
});

app.get("/", (req, res) => {
  Snippet.find({}, '-_id -__v' , (err, allSnippets) => {
    let formatSnippet = []
    // LOOP INFO
    allSnippets.forEach(i =>{
      i.items.forEach(j => {
        formatSnippet.push(i.user+" : "+j)
      });
    })
    
    //console.log("homepage, token from localstorage: ",localStorage.getItem("auth_token"))
    // VIEW INFO
    if(localStorage.getItem('auth_token') === null){
      res.render('home', {view: 'Public', allSnippets: formatSnippet})
    }else{
      const dToken = jwtDecode(localStorage.getItem('auth_token'))
      res.render ('home', {view: 'Private', email: dToken.email, allSnippets: formatSnippet })
    }
  })
});


app.get("/register.html", (req, res) => {
  res.render('register')
});


app.post("/login",
function (req, res, next) {
  //console.log("login, req.body",req.body);
    User.findOne({email: req.body.email}, function (err, user) {
    if (err) throw err;
    if (!user) {
      return res.status(403).json({
        message: "Invalid credentials"
      });
    } else {
      const secret ="WEB9"
      bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
        if (err) throw err;
        //console.log("login: ",user._id.toString())
        if (isMatch) {
          const jwtPayload = {
            email: user.email
          };
          jwt.sign(jwtPayload, secret, {
            expiresIn: 120
          }, function (err, token) {
            console.log("error: ",err);
            console.log("token:",token);
            localStorage.setItem("auth_token", token);
            //console.log("login, token from localstorage: ",localStorage.getItem("auth_token"))
            res.redirect('/')
          });
        }else res.status(403).json({
          message: "Invalid credentials"
        });
      });
    }
  });
});


app.post('/register',
    body('email').isEmail(),
    body('password').isStrongPassword(),
    (req, res) => {
    //console.log("register, req.body:",req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Password is not strong enough"})
      //return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({email: req.body.email}, (err, user) =>{
        if(err) return next(err);
        if(!user){
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) { //From bcrypt
                //console.log("Register, body.email, hash",req.body.email,hash)
                new User({
                    email: req.body.email,
                    password: hash,
                }).save((err) => {
                    if(err) return next(err);
                    console.log("Sending to DB")
                })
                res.redirect("/login.html");
            })
            
        }else{
          console.log("Not sending to DB")
          return res.status(403).json({
            message: "Email already in use"
          });          
          //res.status(403).send({"email": "Email already in use."})
        }
      })
      
    });

app.post('/add-item',validateToken,(req, res) => {
    const email = (req.user.email);
    //console.log("todo: ",email)
    User.findOne({email: email}, (err, user) =>{
        if(err) return next(err);
        //console.log("User id: ",user)
    
    Snippet.findOne({user: user.email}, (err, todo) =>{
        if(err) return next(err);
        //console.log("Searching todo by username: ",todo)
        if (todo === null){
            new Snippet({
                user: user.email,
                items:[req.body.items],
            }).save((err) => {
                if(err) return next(err);
                console.log("Sending to DB")
                res.redirect("/");
            })
            
    }else{todo.items.push(req.body.items);todo.save();res.redirect("/");}
    
})});});

app.listen(port, () => {
    console.log("Server is up'n'running at http://localhost:" + port);
});
