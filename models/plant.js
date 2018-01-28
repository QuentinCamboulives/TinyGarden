var mongoose = require("mongoose");

var plantSchema = mongoose.Schema({
    name: String,
    lightingDuration: Number,
    description: String,
    canBeDel: {
        type: Boolean,
        default: true
    }
});

var Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;