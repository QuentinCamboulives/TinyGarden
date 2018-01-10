//var io = require('socket.io').listen(server);
var port = 8080;
var ip = require('ip');
var path = require('path');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var keypress = require('keypress');
var app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + '/assets')); // Pour charger les assets dans les pages HTML
app.use('/module', express.static(__dirname + '/node_modules/'));

// ------------------------- /Dashboard -------------------------
app.get(['/', '/Dashboard'], function(req, res) {
    res.locals = {
        page: "dashboard",
        ip: ip.address()
    };
    res.render('dashboard');
});

// ------------------------- /Lights -------------------------
app.get('/Lights', function(req, res) {
    res.locals = {
        page: "lights",
        ip: ip.address()
    };
    res.render('lights');
});

// ------------------------- /Params -------------------------
app.get('/Params', function(req, res) {
    res.locals = {
        page: "params",
        ip: ip.address()
    };
    res.render('params');
});

// ------------------------- 404 (All others routes) -------------------------
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable.');
});










// ------------------------- TESTS -------------------------
var PiconZero = require("./PiconZero.js");

PiconZero.init();

PiconZero.setOutputConfig(0, 1); //PWM (Analog)
PiconZero.setOutputConfig(5, 3); //WS2812 (NeoPixel)


console.log("Output on !");
PiconZero.setOutput(0, 1);

console.log("Test Neopixel !");
PiconZero.setPixel();

/*
PiconZero.setPixel(1, 0, 255, 0);
PiconZero.setPixel(2, 0, 0, 255);
PiconZero.setPixel(3, 255, 255, 0);
PiconZero.setPixel(4, 0, 255, 255);*/
//PiconZero.setPixel(5, 255, 0, 255);
//PiconZero.setPixel(2, 0, 0, 255);


/*
var l = 0;
var r = 200;
var g = 0;
var b = 0;
var br = 100

PiconZero.setPixel(0, r, g, b);

  // make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);

// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
    //console.log('got "keypress"', key.name);
    console.log("pixel : " + l, " r : " + r + " g : " + g + " b : " + b + " br : " + br);
  if (key.name == 'q') {
    console.log("Stopping");
    PiconZero.stop();

    console.log("Cleanup");
    PiconZero.cleanup();
    process.exit();
  }

  if (key.name == 'z') {
      r += 10;
  }
  if (key.name == 's') {
    r -= 10;
}
if (key.name == 'e') {
    g+=10;
}
if (key.name == 'd') {
  g-=10;
}
if (key.name == 'r') {
    b+=10;
}
if (key.name == 'f') {
  b-=10;
}
if (key.name == 't') {
    l++;
}
if (key.name == 'g') {
  l--;
}
if (key.name == 'y') {
    br+=10;
    PiconZero.setBrightness(br);
}
if (key.name == 'h') {
  br-=10;
  PiconZero.setBrightness(br);
}
PiconZero.setPixel(l, r, g, b);

});
 
process.stdin.setRawMode(true);
process.stdin.resume();


*/


// Catch du SIGINT pour quitter proprement le programme.
process.on('SIGINT', function() {
    console.log("Stopping");
    PiconZero.stop();

    console.log("Cleanup");
    PiconZero.cleanup();
    
    console.log("-------------------------------------------------------------------");
    console.log("Be careful system goes out, think to take care of your tiny garden.");
    console.log("(If plants are growing, turn the system back on quickly)");
    process.exit();
});

app.listen(port, function() {
    console.log("Server start on http://" + ip.address() + ":" + port);
});





/*
// ------------------ ICI C4EST SMART POOL --------------
//var SmartPool = require('./SmartPool');

// Values at server start
var period = "day" // day - night
var weather = "normal"; // normal - rain
var coverIsOpen = false;
var filtrateIsActive = false;
var waterLevelIsGood = false;
var chloreisGood = false;

io.sockets.on('connection', function (socket) {
    // ----- Init Html page --------------------------------------
    io.emit('connected');
    io.emit('period', period);
    io.emit('weather', weather);
    io.emit('cover', coverIsOpen);
    io.emit('filtrate', filtrateIsActive);
    io.emit('waterLevel', waterLevelIsGood);
    io.emit('chlore', chloreisGood);

    function getSensorsValues(){
        if (SmartPool.getLuxMeter() > 800) {
            period = "night";
        } else if (SmartPool.getLuxMeter() < 800) {
            period = "day";
        }
        io.emit('period', period);
        io.emit('waterTemp', Math.floor(Math.random() * (27 - 24)) + 24);        
        setTimeout(getSensorsValues, 2000);
    }
    getSensorsValues();

    // ----- Cover ----------------------------------------------
    socket.on('cover', function(msg) {
        if (coverIsOpen === true) {
            SmartPool.closeCover();
            coverIsOpen = !coverIsOpen;
            io.emit('cover', coverIsOpen);
        } else if (coverIsOpen === false) {
            SmartPool.openCover();
            coverIsOpen = !coverIsOpen;
            io.emit('cover', coverIsOpen);
        }
    });

    // ----- Filtrate -------------------------------------------
    socket.on('filtrate', function(msg) {
        if (filtrateIsActive === true) {
            filtrateIsActive = !filtrateIsActive;
            SmartPool.filtrate(filtrateIsActive);
            io.emit('filtrate', filtrateIsActive);
        } else if (filtrateIsActive === false) {
            filtrateIsActive = !filtrateIsActive;
            SmartPool.filtrate(filtrateIsActive);
            io.emit('filtrate', filtrateIsActive);
        }
    });

    // ----- Water Level ----------------------------------------
    socket.on('waterLevel', function(msg) {
        if (waterLevelIsGood === true) {
            waterLevelIsGood = !waterLevelIsGood;
            SmartPool.fill(waterLevelIsGood);
            io.emit('waterLevel', waterLevelIsGood);
        } else if (waterLevelIsGood === false) {
            waterLevelIsGood = !waterLevelIsGood;
            SmartPool.fill(waterLevelIsGood);
            io.emit('waterLevel', waterLevelIsGood);
        }
    });

    // ----- Chlore ----------------------------------------
    socket.on('chlore', function(msg) {
        if (chloreisGood === true) {
            SmartPool.addChlore();
            chloreisGood = !chloreisGood;
            io.emit('chlore', chloreisGood);
        } else if (chloreisGood === false) {
            SmartPool.addChlore();
            chloreisGood = !chloreisGood;
            io.emit('chlore', chloreisGood);
        }
    });
});
*/