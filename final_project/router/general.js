const express = require('express');
const _ = require('lodash');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        return  res.send(JSON.stringify(books,null,4));
    })
   
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   

    const req1 = axios.get("https://selvaelangon-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/");
    console.log(req1);
    req1.then(resp => {

        const isbnNumber = req.params.isbn;
        var selectedBook =resp.data[isbnNumber];
        console.log(selectedBook)
        res.send(selectedBook)
    })
    .catch(err => {
        console.log("Rejected for url "+url)
        console.log(err.toString())
    });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const req1 = axios.get("https://selvaelangon-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/");
    console.log(req1);
    
    req1.then(resp => {
        const authorName = req.params.author;
        _.forEach(resp.data, function (value, key) {
            if(value.author == authorName.trim()){  
                console.log(value)
                return res.send(value)
            }
        })
    })
    .catch(err => {
        console.log(err.toString())
        return res.status(300).json({message: "Author not found"});
        
    });

   
    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const req1 = axios.get("https://selvaelangon-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/");
    console.log(req1);
    
    req1.then(resp => {

        const bookTitle = req.params.title;
        _.forEach(resp.data, function (value, key) {
            if(value.title == bookTitle.trim()){  
                return res.send(value)
            }
        })
    })
    .catch(err => {
        console.log(err.toString())
        return res.status(300).json({message: "Book Title not found"});
        
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnNumber = req.params.isbn;
    res.send(books[isbnNumber].reviews)
});

module.exports.general = public_users;
