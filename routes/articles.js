//Dependencies
var express = require('express');
var router = express.Router();
var db = require("../models");

//get route to update 'saved' boolean to true
router.get('/save/:id', function(req,res) {
  db.Article
    .updateOne({
      _id: req.params.id
    },
    {
      $set: {
        saved: true
      }
    })
    .then(function(articles) {
      res.send(articles);
    })
    .catch(function(err) {
      res.json(err);
    })
});

//get route to render savedArticles.handlebars and populate with saved articles
router.get('/viewSaved', function(req, res) {
  db.Article
    .find({
      saved: true,
    })
    .then(function(articles) {
      res.render('savedArticles', {articles})
    })
    .catch(function(err) {
      res.json(err);
    })
});

//delete route to remove an article from savedArticles
router.delete('/deleteArticle/:id', function(req,res){
  db.Article
    .remove({_id: req.params.id})
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.json(err);
    })
});



module.exports = router;