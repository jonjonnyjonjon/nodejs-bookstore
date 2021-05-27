const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookSchema = new Schema({
    ISBN: {
        type: Number,
        unique: true
    },
    title: String,
    price: Number,
    availability: Number
})

module.exports = mongoose.model("Book", bookSchema)