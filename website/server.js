const express = require('express'),
app = express(),
path = require('path'),
fs = require('fs'),

morgan = require('morgan'),

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
        app.get('/forms', (req, res) => {
            res.render('forms');    
        });

        //Register process
        app.post('/register_process', (req, res) => {
            let user, UsernameRegex, UsernameErr, PasswordRegex, PasswordErr;

            user = {
                username: req.body.username,
                password: req.body.password
            };

            UsernameRegex = /^[A-Za-z0-9_]{3,20}$/;
            PasswordRegex = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/

            // Validation for username
            if(!user.username.match(UsernameRegex)) {
                UsernameErr = "Invalid username!";
                res.render('forms', { UsernameErr });
                UsernameErr = undefined;
            }

            // Validation for password
            if(!user.password.match(PasswordRegex)){
                PasswordErr = "Invalid password!";
                res.render('forms', { PasswordErr });
                UsernameErr = undefined;
            }

            // Succeed
            else {
                db.collection('users').insertOne(user)
                    .then(() => {
                        res.redirect('/');
                    })
                    .catch((err) => {
                        console.error(`Error: ${err}`);
                    });
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

