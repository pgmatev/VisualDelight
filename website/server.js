const express = require('express'),
app = express(),
path = require('path'),
fs = require('fs'),

morgan = require('morgan');

bodyParser = require('body-parser'),

// Configs
config = require('./config'),

// MongoClient
MongoClient = require('mongodb').MongoClient;

// View engine pug
app.set('view engine', 'pug');

// Morga logger
app.use(morgan('combined', {
    stream: fs.createWriteStream(path.join(__dirname, '/logs/morgan.log'), 'utf-8')
}));

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/libs', express.static(path.join(__dirname, '/public/libs')));
app.use('/app', express.static(path.join(__dirname, '/public/app')));

MongoClient.connect( config.dbConfig.getUrl() )

    .then((db) => {
        console.log("Connected to MongoDB");
        return db;
    })

    .then((db) => {

        // Simple routing to home page
        app.get('/', (req, res) => {
            res.render('index');
        });

        //To Register page routing
        app.get('/register', (req, res) => {
            res.render('register');    
        });

        //Register process
        app.post('/register_process', (req, res) => {
            let user, usernameRegex, UsernameErr, passowrdRegex, PasswordErr;

            user = {
                username: req.body.username,
                password: req.body.password
            };

            usernameRegex = "/^[a-zA-Z0-9]+$/";
            passowrdRegex = "/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/";

            // Validation for username
            if(user.username.match(usernameRegex)) {
                UsernameErr = "Invalid username!";
                res.render('register', { UsernameErr });
                UsernameErr = undefined;
            }

            // Validation for password
            if(user.password.match(passowrdRegex)){
                PasswordErr = "Invalid password!";
                res.render('register', { PasswordErr });
                UsernameErr = undefined;
            }

            // Succeed
            else {
                res.redirect('/');
            }
        });    

    })    

    .then(() => {    
        app.listen(3001, () => {
            console.log("Server running at http://127.0.0.1:3001");
        });
    })    

    .catch((err) => {
        console.error(`Error: ${err}`);
    });

