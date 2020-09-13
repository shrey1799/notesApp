const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect(
  "mongodb+srv://shrey:test123@cluster0.ydsfm.mongodb.net/notesDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  created_at: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

app.get("/", (req, res) => {
  Note.find({}, (err, results) => {
    if (!err) {
      exports.notesCreated = results;
      res.render("main", { results: results, moment: moment });
    } else {
      console.log(err);
    }
  });
});

app.get("/addNote", (req, res) => {
  res.render("create");
});

app.post("/addNote", (req, res) => {
  // console.log(req.body);
  const newNote = new Note({
    title: req.body.noteTitle,
    body: req.body.noteBody,
  });
  newNote.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  let noteDeleted = req.body.deleteNote;
  Note.deleteOne({ _id: noteDeleted }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server at 3000");
});
