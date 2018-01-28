//var io = require('socket.io').listen(server);
var port = 8080;
var ip = require('ip');
var path = require('path');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var TinyGarden = require('./src/TinyGardenUtils');
var app = express();
var flash = '';

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + '/assets')); // Pour charger les assets dans les pages HTML
app.use('/module', express.static(__dirname + '/node_modules/'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// ------------------------- DB connection ------------------
mongoose.connect("mongodb://localhost/TinyGardenDB");
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion à la DB.')); 
db.once('open', function (){
    console.log("Connexion à la base OK.");
});
var Garden = require("./models/garden");
var Plant = require("./models/plant");

// ------------------------- /Garden ----------------------
app.get(['/', '/Garden'], function(req, res) {
    Garden.find({}).populate('plant').then(garden => {
        res.locals = {
            page: "garden",
            plantes: garden
        };
        res.render('garden');
    });
});

// ------------------------- /Plant -------------------------
app.get('/Plant/:id', function(req, res) {
    Plant.find({}).then(plants => {
        res.locals = {
            page: "plant",
            id: req.params.id,
            plants: plants,
            flash: getFlash()
        };
        res.render('plant');
    });
});

// ------------------------- /Plants -------------------------
app.get('/Plants', function(req, res) {
    Plant.find({}).then(plants => {
        res.locals = {
            page: "plants",
            plants: plants,
            flash: getFlash()
        };
        res.render('plants');
    });
});

app.post('/Plants', function(req, res) {
    if (req.body.name != '' && req.body.lightingDuration != '' && req.body.description != '') {
        var plant = new Plant();
        plant.name = req.body.name;
        plant.lightingDuration = req.body.lightingDuration;
        plant.description = req.body.description;
        //plant.canBeDel = true; Décommenter une fois l'ajout des plantes mandatory fait. (Permet de pouvoir supprimer des plantes mais pas celles de base)
        plant.save(function(err){
            if(err){
                flash = 'Erreur :' + err;
            } else {
                flash = 'La plante à bien été joutée.';
            }
        });
    }
    res.redirect('/Plants');
});

app.post('/Plants/Delete', function(req, res) {
    if (req.body.id != ''){
        Plant.remove({_id: req.body.plantId}, function(err){
            if (err){
                flash = 'Erreur :' + err;
            } else {
                flash = 'La plante à bien été supprimée.';
            }
        });
    }
    res.redirect('/Plants');    
});

// ------------------------- /Lights -------------------------
app.get('/Lights', function(req, res) {
    res.locals = {
        page: "lights",
        ip: ip.address()
    };
    res.render('lights');
});

// ------------------------- /Tips -------------------------
app.get('/Tips', function(req, res) {
    res.locals = {
        page: "tips",
    };
    res.render('tips');
});

// ------------------------- /Params -------------------------
app.get('/Params', function(req, res) {
    res.locals = {
        page: "params",
        lightStart: 8,
        wateringInterval: 4,
        wateringDuration: 10,
    };
    res.render('params');
});

app.post('/Params', function(req, res) {
    if (req.body.lightStart != ''){
        console.log("Ligh start  :" + req.body.lightStart);        
    }
    if (req.body.wateringInterval != '') {
        console.log("Watering interval :" + req.body.wateringInterval);
    }
    if (req.body.wateringDuration != '') {
        console.log("Watering duration :" + req.body.wateringDuration);
    }
    res.redirect('/Params');    
});

// ------------------------- 404 (All others routes) -------------------------
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable.');
});

// Catch du SIGINT pour quitter proprement le programme.
process.on('SIGINT', function() {
    //TinyGarden.cleanup();
    db.close();
    process.exit();
});

app.listen(port, function() {
    console.log("Server start on http://" + ip.address() + ":" + port);
});

function getFlash() {
    let flashTmp;

    if (typeof flash !== 'undefined' && flash != '') {
        flashTmp = flash;
        flash = '';
    }
    return flashTmp;
}