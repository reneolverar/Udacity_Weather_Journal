// Server side code - Udacity project weather journal app
/* Empty JS object to act as endpoint for all routes */
projectData = {};
projectData.journal = [];

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// Dependencies
const bodyParser = require('body-parser')
// Here we are configuring Express to use body-parser als middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initializing the main project folder
app.use(express.static('website'));

// Set our variable for port. In this example it´s 8000.
const port = 8000;

// Spin up the server. Utilize the .listen() method
// Set your variable named server, and pass the listen method with two arguments port and listening.
const server = app.listen(port, listening);
// The port argument refers to the port variable we set above. The listening argument refers to a callback function we create.

// The listening function will run when we execute the listen method to let you know (callback to debug) that the server is running and on which port by logging messages to the console.
function listening(){
     console.log("server running");
     console.log(`running on localhost: ${port}`);
};

// POST route
app.post('/addWeatherData', addWeatherData);

function addWeatherData(req, res){
    console.log(req.body);
    newEntry = {
        temp: req.body.temp,
        date: req.body.date,
        feel: req.body.feel,
        city: req.body.city,
        country: req.body.country
    };
    projectData.journal.push(newEntry);
    res.send(projectData.journal);
    console.log(projectData.journal);
    console.log(projectData.journal);
}

// GET route for journalData
app.get('/journalData', getData)
function getData(req, res) {
    res.send(projectData.journal)
    console.log(projectData.journal)
}

// GET route for projectData
app.get('/all', getJournalData)
function getJournalData(req, res) {
    res.send(projectData)
    console.log(projectData)
}