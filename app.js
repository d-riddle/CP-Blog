//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash=require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-ankit:123@cluster0.f47j9.mongodb.net/blogDB?retryWrites=true&w=majority");

const bSchema={
  btitle:String,
  bbody:String
};

const Bpost=mongoose.model("Bpost",bSchema);

// const bpost1=new Bpost({
//   btitle: "post1",
//   bbody: "how are you"
// });
// const bpost2=new Bpost({
//   btitle:"post2",
//   bbody:"i am fine"
// });
//
// let darr=[bpost1,bpost2];
// Bpost.insertMany(darr,function(err){
//   if(err){
//     console.log(err);
//   } else{
//     console.log("succesfully saved to DB");
//   }
// });

//let arr=[];

app.get("/about",function(req,res){
  res.render("about",{aboutcontent:aboutContent});
});
app.get("/contact",function(req,res){
  res.render("contact",{contactcontent:contactContent});
});
app.get("/compose",function(req,res){
  res.render("compose");
});
// app.get("/delete",function(req,res){
//   res.render("delete");
// });
// app.get("/updcompose",function(req,res){
//   res.render()
// });

app.get("/",function(req,res){
  Bpost.find({},function(err,postitem){
    if(err){
      console.log(err);
    }else {
      res.render("home",{homecontent:homeStartingContent,
      addcontent:postitem});
    }
  });

});

app.get("/posts/:topic",function(req,res){
  let myvar=req.params.topic;
  let flag=false;

  Bpost.findOne({_id:myvar},function(err,post){
    if(err){
      console.log(err);
    }else {
      res.render("post",{fullPagePost:post});
      //console.log("Match Found");
    }
  });

});
app.post("/compose",function(req,res){
  const bpost=new Bpost({
    btitle:req.body.postTitle,
    bbody:req.body.postBody
  });
  bpost.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
  // const obj={
  //   tit:req.body.postTitle,
  //   bod:req.body.postBody
  // };
  // arr.push(obj);
});
app.post("/delete",function(req,res){
  const posttodelete=req.body.dpost;
  //console.log(posttodelete);
  Bpost.deleteOne({_id:posttodelete},function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  });

});

//uncomment when you want to use update
// app.post("/update",function(req,res){
//   let myupdpost=req.body.updpost;
//   console.log(myupdpost);
//   res.render("updcompose",{blogppost:myupdpost});
// });
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});
