const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true}
})

const Note = mongoose.model("Notes", noteSchema)

module.exports = Note