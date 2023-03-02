const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Schema for Code snippets with email address and code snippet posts are in items array

let snippetSchema = new Schema({
    user: String,
    items: Array,
});

module.exports = mongoose.model("Snippet", snippetSchema);
