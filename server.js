var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var path = require("path");

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/articles',express.static(path.join(__dirname, 'public')));
app.use('/notes',express.static(path.join(__dirname, 'public')));


// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Routes
var index = require('./routes/index');
var articles = require('./routes/articles');
var notes = require('./routes/notes');
var scrape = require('./routes/scrape');

app.use('/', index);
app.use('/articles', articles);
app.use('/notes', notes);
app.use('/scrape', scrape);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Connect to the Mongo DB
var config = require('./config/database');
mongoose.Promise = Promise;
mongoose
  .connect(config.database)
  .then(function(result) {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
  })
  .catch(function(err) {
  console.log('There was an error with your connection:', err);
  });

// Start the server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

module.exports = app;

