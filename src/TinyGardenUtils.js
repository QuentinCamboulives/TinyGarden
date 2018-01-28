var keypress = require('keypress');
var PiconZero = require("./PiconZero");

function TinyGardenUtils() {
    
    this.tests = function() {
        PiconZero.init();
        PiconZero.setOutputConfig(0, 1); //PWM (Analog)
        PiconZero.setOutputConfig(5, 3); //WS2812 (NeoPixel)
        
        PiconZero.setOutput(0, 1); // Allumage de la led verte
        
        console.log("Test Neopixels.");
        PiconZero.setPixel(1, 0, 255, 0);
        PiconZero.setPixel(2, 0, 0, 255);
        PiconZero.setPixel(3, 255, 255, 0);
    }

    this.cleanup = function() {
        console.log("Stopping motors.");
        PiconZero.stop();
        console.log("Cleanup board.");
        PiconZero.cleanup();
        console.log("-------------------------------------------------------------------");
        console.log("Be careful system goes out, think to take care of your tiny garden.");
        console.log("(If plants are growing, turn the system back on quickly)");
    }

    this.getNeoPixelKey = function() {
        var l = 0;
        var r = 200;
        var g = 0;
        var b = 0;
        var br = 100

        // make `process.stdin` begin emitting "keypress" events 
        keypress(process.stdin);
        // listen for the "keypress" event 
        process.stdin.on('keypress', function (ch, key) {
            console.log("pixel : " + l, " r : " + r + " g : " + g + " b : " + b + " br : " + br + " KeyName :" + key.name);
            if (key.name == 'q') {
                console.log("PiconZero cleanup");
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
    }

}

module.exports = new TinyGardenUtils();

/*
// ------------------ SMART POOL --------------
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