const express = require('express');
const app = express();
//using path to be able to start the server from any directory in terminal, without breaking anything
const path = require('path');

//register server to start listening on port 3000
app.listen(3000, ()=> {
    console.log('Server running on port 3000');
});

//to enable usage on embedded javascript in html files later on, setting now so i don't forget
app.set('view engine', 'ejs');

//if this line is removed 'node intex.js' command in the terminal can only be run if we are currently in the project directory
app.set('views', path.join(__dirname, 'views'));

//most basic test response on home('/') page
app.get('/', (req,res) => {
    res.send("Hello from server!");
});