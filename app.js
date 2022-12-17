const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
const articleSchema=new mongoose.Schema({
    title:String,
    content: String
})

const Article= mongoose.model("Article",articleSchema);

/////////////////////////// Requests targetting all Articles /////////////////////////////
// we can use postman to making post requests and check if that works.
// in the deleteMany() method we are not passing any set of conditions
// app.route() helps us create chainable route handlers
app.route("/articles")
.get(function(req,res){
    // in find() method we are here not sending any conditions
    Article.find(function(err,foundArticles){
        if(!err)
        res.send(foundArticles);
        else res.send(err);
    })
})
.post(function(req,res){
    const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }
        else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    // in the deleteMany() method we are not passing any set of conditions
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the articles.")
        }
        else{
            req.send(err);
        }
    })
});

/////////////////////////// Requests targetting specific Articles /////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArticles){
        if(foundArticles){
            res.send(foundArticles);
        }
        else{
            res.send("No such article found");
        }
    })
})
.put(function(req,res){
    Article.updateMany(
        {title:req.params.articleTitle},
        {title:req.body.title, content: req.body.content},
        function(err){
            if(!err)
            res.send("Successfully updated article.");
        }
    )
})
.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully Updated articles");
            }
            else{
                res.send(err);
            }
        }
    );
})
.delete(function(req,res){
    Article.deleteMany(
        {title: req.params.articleTitle},
        function(err){
        if(!err){
            res.send("Successfully deleted the article.")
        }
        else{
            req.send(err);
        }
    })
});
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });


/////////////////////////////  Ex. INFO to START WITH /////////////////////////////   
// [
//     {
//         "_id": "639d6659f6e1337d2b89a23b",
//         "title": "REST",
//         "content": "REST is short for REpresentational State Transfer. It's an architectural style for designing APIs."
//     },
//     {
//         "_id": "639d684ff6e1337d2b89a23c",
//         "title": "API",
//         "content": "API stands for Application Programming Interface. It is a set of subroutine definitions."
//     },
//     {
//         "_id": "639d6899f6e1337d2b89a23d",
//         "title": "Bootstrap",
//         "content": "This is a framework developed by Twitter that contains pre-made front-end templates for faster development."
//     },
//     {
//         "_id": "639d68d9f6e1337d2b89a23e",
//         "title": "DOM",
//         "content": "The Document Object Model is like an API for interacting with our HTML."
//     },
//     {
//         "_id": "639d75f5dfdc36e30ae31c25",
//         "title": "Eisenhower",
//         "content": "Dwight David \"Ike\" Eisenhower was an American military officer and statesman who served as the 34th president of the United States from 1953 to 1961. During World War II, he served as Supreme Commander of the Allied Expeditionary Force in Europe and achieved the five-star rank of General of the Army.",
//         "__v": 0
//     }
// ]
