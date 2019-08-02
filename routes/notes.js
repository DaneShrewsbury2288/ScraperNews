//Dependencies
var express = require('express');
var router = express.Router();
var db = require("../models");


//get route to retrieve all notes for a particlular article

router.get('/getNotes/:id', function (req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate('notes')
    .then(function(results) {
      res.json(results);
    })
    .catch(function (err) {
      res.json(err);
    })
});

//get route to return a single note to view it
router.get('/getSingleNote/:id', function (req, res) {
  db.Note
    .findOne({ _id: req.params.id })
    .then(function (result) {
      res.json(result);
    })
    .catch(function (err) {
      res.json(err);
    })
});

//post route to create a new note in the database

router.post('/createNote', function (req, res) {
    // Create a new Note in the db
    db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbArticle) {
      // If the User was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});


//   var { title, body, articleId } = req.body;
//   var note = {
//     title,
//     body
//   };
//   db.Note
//     .create(note)
//     .then(function (result) {
//       db.Article
//         .findOneAndUpdate({ _id: articleId }, { $push: { notes: result._id } }, { new: true })//saving reference to note in corresponding article
//         .then(function (dbUser) {
//           res.json(dbUser);
//         })
//         .catch(function (err) {
//           res.json(err);
//         })
//     });
// });

//post route to delete a note
router.post('/deleteNote', function (req, res) {
  var { articleId, noteId } = req.body;
  db.Note
    .deleteOne({ _id: noteId })
    .then(function (result) {
      res.json(result);
    })
    .catch(function (err) {
      res.json(err);
    })
});


module.exports = router;