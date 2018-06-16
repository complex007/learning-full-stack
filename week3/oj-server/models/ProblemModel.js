const mongoose = require("mongoose");
const ProblemSchema = mongoose.Schema({
    id : Number,
    name : String,
    difficulty : String,
    desc : String
});
const ProblemModel = mongoose.model('ProblemModel', ProblemSchema);
module.exports = ProblemModel;

