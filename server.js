const express = require('express');
const app = express();
const port = 4000;
var parser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');


var url = "mongodb://localhost:27017/blogdb";
var databasename = "blogdb";
var FinalUrl = url + databasename;

//Linking the css to the js files 
app.use(express.static("public/src"));
//Mongoose connection
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });



//this is the Schema
const items = new mongoose.Schema({
    ID: Number,
    publisher: String,
    description: String,
    Date: Date,
    Title: String,
    imgUrl: String
});



const users = new mongoose.Schema({
    ID: String,
    username: String,
    password: String,
    email: String
})

const UserModel = mongoose.model("User", users);


//this is todays date
var dates = new Date;
var today = dates.toLocaleString();

//this is the model 
const NewItem = mongoose.model("NewItem", items);


app.use(parser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//Home Sction / API
app.get('/', (req, res) => {

    var apiurl = "http://localhost:4000/api/";
    http.get(apiurl, (response) => {


        response.on('data', (datas) => {

            var parsedata = JSON.parse(datas);

            res.render('index', { front: parsedata });
        });

    }).on('error', (e) => {
        console.error(e);
        res.json({ "Response": "Error has occured" })
    });



})

//Add Blog Sction
app.get('/add', (req, res) => {
    res.render('./pages/add');
})

//Add Blog Function
app.post('/add', (req, res) => {

    var Title = req.body.Title;
    var Description = req.body.Description;
    var Author = req.body.publisher;
    var imageurl = req.body.imgurl;
    var date = Date.now();
    var currentDate = today;

    const data = new NewItem({
        ID: date,
        publisher: Author,
        description: Description,
        Date: currentDate,
        Title: Title,
        imgUrl: imageurl
    });

    data.save();
    res.redirect('/');
    res.json({ "Success": "Has been Succeedeed" });

});

//API Section
app.get('/api/', (req, res) => {

    NewItem.find(function(err, newitems) {
        if (err) throw err;
        res.json(newitems);
    })
});

//Login Section
app.get('/login', (req, res) => {
    res.render('./pages/login');
})

var email = "";
var password = "";

//Login Function
app.post('/login', (req, res) => {
    email = req.body.email;
    password = req.body.password;

    UserModel.find({ "email": email }, function(err, user) {
        if (err) res.json({ "status": "Authentication unSuccessful" });

        if (user[0].email === email && user[0].password === password) {
            res.redirect('/dashboard');
        } else {
            res.json({ "status ": "Authentication Failed" });
        }


    })
    res.redirect('/dashboard');
})


//Register Button on Login Page
app.get('/registers', (req, res) => {
    res.render('./pages/register');

})
app.post('/registers', (req, res) => {
    var name = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var date = Date.now();


    const auser = new UserModel({
        ID: date,
        username: name,
        password: password,
        email: email

    })

    auser.save();

    res.redirect('/register');
})

//Dashboard Section
app.get('/dashboard', (req, res) => {
    res.render('./pages/dashboard');
})
app.post('/dashboard', (req, res) => {
        var name = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var date = Date.now();


        const auser = new UserModel({
            ID: date,
            username: name,
            password: password,
            email: email

        })

        auser.save();

        res.redirect('/register');
    })
    //Register Section
app.get('/register', (req, res) => {
    res.render('./pages/register');

})


app.post('/register', (req, res) => {
    var name = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var date = Date.now();


    const auser = new UserModel({
        ID: date,
        username: name,
        password: password,
        email: email

    })

    auser.save();

    res.redirect('/dashboard');
})

//Link to the server 
app.listen(port, (req, res) => {
    console.log("Server is up and running on port " + port)
})