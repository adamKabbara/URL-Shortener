'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const shortid = require('shortid');
var app = express();


var port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname + "/views"));  






const domainSchema = mongoose.Schema({
  url: String,
  id: String
})


var Domain = mongoose.model('Domain', domainSchema) 

app.post('/api/shorturl/new', function(req,res){ 
  Domain.exists({url: req.body.url}, function(err,result){
    if(result){
      Domain.find({url: req.body.url}, function(err,doc){
        res.json({"url": doc[0].url, "shortURL": doc[0].id})
      })
    }else{
       const newDomain = new Domain({
    url: req.body.url,
    id: shortid.generate()
  })
  newDomain.save().then(result => {console.log(result)}).catch(err => {console.log(err)})
  res.json({"url": newDomain.url, "shortURL": newDomain.id})
    }
    
  });

})
 
app.get('/api/shorturl/:id', function(req,res){
  Domain.exists({id: req.params.id}, function(err,result){
    if(err) return console.log(err)
      if(result){
        
        Domain.find({id: req.params.id}, function(err,doc){
            if(err) return console.log(err);
          res.redirect(doc[0].url);
          
            
        })
        
    }else{
      console.log("Test");
      res.json({"error":"No short url found for given input"})
    }
  });
 
  })



app.listen(port, function () {
  console.log('Node.js listening ...'); 
});       