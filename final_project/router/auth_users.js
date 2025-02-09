const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const _ = require('lodash');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let validusers = users.filter((user)=>{
        return (user.username === req.body.username)
    });
    
    if(validusers.length > 0){
        var b = books[req.params.isbn];

        let filtered_array = _.filter(
            b.reviews, function (o) {
                return (o.username === req.body.username)
            }
        );
        
        console.log(filtered_array);
        if(filtered_array.length > 0){
            
            _.forEach(b.reviews, function (value, key) {
                if(value.username == req.body.username){
                    books[req.params.isbn].reviews[key].review = req.body.review;
                }
            });
        }else{
            b.reviews.push({"username":req.body.username, "review":req.body.review});
        }
       
        return  res.send(JSON.stringify(b));
         
    } else {
        return res.status(208).json({message: "User not loggedin"});
    }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbnNumber = req.params.isbn;
    if (isbnNumber){
        delete books[isbnNumber]
    }
    res.send(`book with the isbn  ${isbnNumber} deleted.`)
}); 
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
