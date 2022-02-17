const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");

const homeStartingContent = "Welcome to the blog!";
const aboutContent = "Hi! I am Navsheel Biral, writing blogs just for fun! Check it out and let me know!";
const contactContent = "Email: navsheel.1235@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


main().catch(err => console.log(err)); 

async function main() {
  await mongoose.connect('mongodb+srv://admin-navsheel:test123@cluster0.qqbmw.mongodb.net/blogDB');
}

const postSchema= new mongoose.Schema({
  title: String,
  content: String
});

const Post=mongoose.model("Post",postSchema);


app.get("/", function(req, res){
  Post.find({},function(err,posts){
    res.render("home",{startingContent:homeStartingContent, posts:posts})
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

  

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = (req.params.postId);
    Post.findOne({_id:requestedPostId},function(err,post){
      if(!err){
        res.render("post", {title:post.title,content:post.content});
      }
    });

});


let port=process.env.PORT;
if (port== null||port==""){
  port=3000;
}
app.listen(port, function(){
  console.log("Server started.");
});
