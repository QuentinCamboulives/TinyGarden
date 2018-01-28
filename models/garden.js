var mongoose = require("mongoose");

var gardenSchema = mongoose.Schema({
    plantNumber: Number,    
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant'
    },
    stage: {
        type: Number,
        default: 1
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    lightStart: Number,
});

var Garden = mongoose.model('Garden', gardenSchema);

module.exports = Garden;