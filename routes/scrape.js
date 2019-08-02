//Dependencies
var express = require('express');
var router = express.Router();
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

//get route to root, populating index.handlebars with articles
router.get("/newArticles", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/topic/organization/national-basketball-association-nba").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        newArticleArray = [];

        // For each with an atom commentary class
        $("article.story.theme-summary").each(function (i, element) {
            var newArticle = new db.Article({

                // Adding to the newArticle object
                headline: $(element).find("h2.headline").text().trim(),
                author: $(element).find("p.byline").text().trim(),
                summary: $(element).find("p.summary").text().trim(),
                imgUrl: $(element).find("img").attr('src'),
                link: $(element).find("a.story-link").attr('href'),

            });
            
                newArticleArray.push(newArticle);

        });
        console.log(newArticleArray)
        // Create a new Article using the `result` object built from scraping
        db.Article.create(newArticleArray)
            .then(function (dbArticle) {
                // View the added result in the console
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
            });
    });
});

module.exports = router;
