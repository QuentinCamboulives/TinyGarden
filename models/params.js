var mongoose = require("mongoose");

var parameterSchema = mongoose.Schema({
    lightStart: {
        type: Number,
        default: 8
    },
    wateringInterval: {
        type: Number,
        default: 4
    },
    wateringDuration: {
        type: Number,
        default: 10
    }
});

var Parameter = mongoose.model('Params', parameterSchema);

module.exports = Parameter;