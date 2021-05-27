const express = require("express")
const app = express()
const mongoose = require("mongoose")
const url = "mongodb://127.0.0.1:27017/yorobookstore"

// MongoDB connection
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log("Database connected:", url)
})
const Book = require("./models/Book")


// Express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.get("/browse", (req, res) => {
    Book.find({}, (err, books) => {
        res.render("browse.ejs", { books: books })
    })
})

app.post("/browse", (req, res) => {
    Book.find({ 
        title: { $regex: req.body.keyword, $options: "i" } }, 
        (err, books) => {
            res.render("browse.ejs", { books: books })
        }
    )
})

app.delete("/browse", (req, res) => {
    Book.deleteOne({
        ISBN: req.body.ISBN
    })
        .then(() => { res.json("Success") })
        .catch(error => console.error(error))
})

app.get("/add", (req, res) => {
    res.render("addBook.ejs")
})

app.post("/add", (req, res) => {
    const newBook = new Book({
        ISBN: req.body.ISBN,
        title: req.body.title,
        price: req.body.price,
        availability: req.body.availability
    })

    let msg = "Add book succesful"
    newBook.save((err, user) => {
        // error handling~
        console.log(err)
        if (err != null) {
            msg = "Error adding book, try again later"
        }
        res.render("addBook.ejs", { msg: msg })
    })
})



app.listen(3000, () => console.log("Listening to port 3000..."))