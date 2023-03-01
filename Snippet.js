const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let snippetSchema = new Schema({
    user: String,
    items: Array,
});

module.exports = mongoose.model("Snippet", snippetSchema);
