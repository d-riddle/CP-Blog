//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash=require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "This is a competitive programming journal where group of cp enthusiasts brings good article of certain cp topics at one place, so that we can learn effectively and easily.We try to include all important data structures and algorithms needed to master cp. Please use this site only to read and if you want to contribute some article to this website then first contact us with info given in contact us page. I hope this website will prove resoursefull to you all. Happy learning!";
const aboutContent = "Presently, this site is maintained by me. I initially designed this site for myself so that i can bring all important tricks and ideas related to competitive programmming that i learn from different sites and blogs at one place for future revision. Later i decided to give to some of my close friends so that we all can learn effectively and easily.Please use this site only to read and if you want to contribute some article to this website then first contact us with info given in contact us page.";
const contactContent = "You can contact us at codeforces my id is riddle279 . You can also contact us with mail my email is sahoo####@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-ankit:123@cluster0.f47j9.mongodb.net/blogDB?retryWrites=true&w=majority", { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('MongoDB connected!!');
}).catch(err => {
  console.log('Failed to connect to MongoDB', err);
});
const opts = {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};
const bSchema=mongoose.Schema({
  btitle:String,
  bbody:String,
},opts);

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
  Bpost.find({},null,{sort: {createdAt: -1}},function(err,postitem){
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
    bbody:req.body.postBody,
  });
  bpost.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});
app.post("/updcompose",function(req,res){
    const pid=req.body.postid;
    const ptitle=req.body.postTitle;
    const pbody=req.body.postBody;
    Bpost.deleteOne({_id:pid},function(err){
      if(err){
        console.log(err);
      }else{
        const bpost1=new Bpost({
          btitle:ptitle,
          bbody:pbody,
        });
        bpost1.save(function(err){
          if(!err){
            res.redirect("/");
          }
        });

      }
    });
  });
  // const obj={
  //   tit:req.body.postTitle,
  //   bod:req.body.postBody
  // };
  // arr.push(obj);

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
app.post("/update",function(req,res){
  let myupdpost=req.body.updpost;
  Bpost.findOne({_id:myupdpost},function(err,post){
    if(err){
      console.log(err);
    }else {
      res.render("updcompose",{blogppost:post});
      //console.log("Match Found");
    }
  });
  //res.render("updcompose",{blogppost:myupdpost});
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});
