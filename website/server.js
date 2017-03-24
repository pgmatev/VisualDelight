const express = require('express'),
app = express(),
path = require('path'),

config = require('./config'),

MongoClient = require('mongodb').MongoClient;


app.set('view engine', 'pug');

app.use('/libs', express.static(path.join(__dirname, '/public/libs')));
app.use('/app', express.static(path.join(__dirname, '/public/app')));

MongoClient.connect(config.dbConfig.url)

    .then((db) => {
        console.log("Connected to MongoDB");
        return db;
    })

    .then((db) => {

        // Simple routing to home page
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '/public/app/index.html'));
        });

        //Register routing
        app.get('/to_register', (req, res) => {
            res.render('register');    
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

