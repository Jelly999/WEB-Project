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
  //Delete authorization token from local storage to deauthorize user. 
  localStorage.removeItem('auth_token')
  res.redirect('/');
});

app.get("/", (req, res) => {
  Snippet.find({}, '-_id -__v' , (err, allSnippets) => {
    let formatedSnippet = []
    // Loop takes all database posts and adds user to them. After that posts are pushed to formated list that is passed on to pug.
    allSnippets.forEach(i =>{
      i.items.forEach(j => {
        formatedSnippet.push(i.user+" : "+j)
      });
    })
    
    // If user is logged in, auth_token is not null then private view is displayed. Othervise public view is presented to user without option to post snippets. Token is decoded to extract email address that is displayed in the view. 
    if(localStorage.getItem('auth_token') === null){
      res.render('home', {view: 'Public', allSnippets: formatedSnippet})
    }else{
      const dToken = jwtDecode(localStorage.getItem('auth_token'))
      res.render ('home', {view: 'Private', email: dToken.email, allSnippets: formatedSnippet })
    }
  })
});


app.get("/register.html", (req, res) => {
  res.render('register')
});


app.post("/login",
function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
    if (err) throw err;
    if (!user) {
      return res.status(403).send('message: "Invalid credentials" ');//User not found
    } else {
      const secret ="WEB9"
      bcrypt.compare(req.body.password, user.password, function (err, isMatch) { //Bcrycpt is used to hash the password
        if (err) throw err;
        if (isMatch) { //User password maches to one in the database, thus authorizing the login.
          const jwtPayload = { //User email is used in the JWT payload.
            email: user.email
          };
          jwt.sign(jwtPayload, secret, {
            expiresIn: 120
          }, function (err, token) {
            console.log("error: ",err);
            console.log("token:",token);
            localStorage.setItem("auth_token", token); //Token is stored in the local storage. 
            res.redirect('/') //Redirected to homepage after successfull login
          });
        }else res.status(403).send('message: "Invalid credentials"'); //If password is wrong, invalid credentials message is shown 
        
      });
    }
  });
});


app.post('/register',
    body('email').isEmail(), //Testing that email given is email address format. 
    body('password').isStrongPassword(), //Testing with predefined arguiments that password is strong. 
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send('message: "Password is not strong enough"') //Returned if password does not meet requirements. 
    }
    User.findOne({email: req.body.email}, (err, user) =>{ //Check if email address is already in use. 
        if(err) return next(err);
        if(!user){
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) { //Bcrycpt is used to hash the password.
                new User({ //Create new user.
                    email: req.body.email,
                    password: hash,
                }).save((err) => { //Save new user to database. 
                    if(err) return next(err);
                    console.log("Sending to DB")
                })
                res.redirect("/login.html"); //Redirect to login page after successful register. 
            })
            
        }else{ //Register was not successfull. 
          console.log("Not sending to DB") 
          return res.status(403).send('message: "Email already in use"');
        }
      })
      
    });

    //Adds new code snippet to database. 
app.post('/add-item',validateToken,(req, res) => { //Validate token checks that user is logged in. 
    const email = (req.user.email);
      
    Snippet.findOne({user: email}, (err, todo) =>{ //Find the user that post is assosiated to.
        if(err) return next(err);
        //console.log("Searching todo by username: ",todo)
        if (todo === null){ //If user does not have any post already, new database entry is made.
            new Snippet({ //New snippet to database
                user: email,
                items:[req.body.items],
            }).save((err) => { //Save to database
                if(err) return next(err);
                console.log("Sending to DB")
                res.redirect("/"); //Redirect to home and show new post. 
            })
    }else{todo.items.push(req.body.items);todo.save();res.redirect("/");} //If user has posts already, new post is added to the list.
    })
  });

app.listen(port, () => {
    console.log("Server is up'n'running at http://localhost:" + port);
});
