const express = require('express');
const bodtParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

app.use(cors({
  origin: '*'
}));

mongoose.connect('mongodb://localhost:27017/contentDB', {userNewUrlParser: true})

const articleSchema = {
  title: String,
  content: Object
};

const Article = mongoose.model('Article', articleSchema);
app.get("/articles", function(req, res){
  Article.find(function(err, foundAriticles){
    if (foundAriticles) {
      res.send({data: foundAriticles});
    } else {
      res.send("No articles currently");
    }
  })
})

.post(function(req, res){
  const newArticle = Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all the articles");
    } else {
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")

.get(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.findOne({title: articleTitle}, function(err, article){
    if (article){
      const jsonArticle = JSON.stringify(article);
      res.send(jsonArticle);
    } else {
      res.send("No article with that title found.");
    }
  });
})

.patch(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title: articleTitle},
    {content: req.body.newContent},
    function(err){
      if (!err){
        res.send("Successfully updated selected article.");
      } else {
        res.send(err);
      }
    });
})

.put(function(req, res){

  const articleTitle = req.params.articleTitle;

  Article.update(
    {title: articleTitle},
    {content: req.body.newContent},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})


.delete(function(req, res){
  const articleTitle = req.params.articleTitle;
  LostPet.findOneAndDelete({title: articleTitle}, function(err){
    if (!err){
      res.send("Successfully deleted selected article.");
    } else {
      res.send(err);
    }
  });
});

app.listen(3001, function() {
  console.log('Server start ...');
})