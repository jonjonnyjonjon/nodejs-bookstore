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

    let msg = []
    newBook.save((err, user) => {
        if (err != null) {
            for (const [key, value] of Object.entries(err.errors)) {
                msg.push(`Value of ${key} should be ${value.kind}, but a ${value.valueType} is given`) 
            }
        } else {
            msg.push("Book added successfully")
        }
        res.render("addBook.ejs", { msg: msg })
    })
})

app.get("/update", (req, res) => {
    Book.findOne({ ISBN: req.query.ISBN }, (err, book) => {
        res.render("updateBook.ejs", {book: book})
    })
})

app.post("/update", (req, res) => {
    Book.updateOne({
        ISBN: req.body.ISBN,
        title: req.body.title,
        price: req.body.price,
        availability: req.body.availability
    })
        .then(() => { res.redirect("/browse") })
        .catch(error => console.error(error))
})

app.listen(3000, () => console.log("Listening to port 3000..."))