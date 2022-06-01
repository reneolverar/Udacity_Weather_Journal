// Client side code - Udacity project weather journal app

/* Global Variables */
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Fetching information from APIs:
// Define dynamic URL with base, user input and key
/* https://openweathermap.org/ API call with fecht */
// API call example: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=88cf582b854015fe9a9bc336d95d235b
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// Personal API Key for OpenWeatherMap API
const apiKey = 'appid=88cf582b854015fe9a9bc336d95d235b&units=metric';
// Event listener button to call weither API for chosen city
document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
  // Requested zipcode
  const zipCode = document.getElementById('zip').value + ',us&';
  // Registered feeling
  const feeling = document.getElementById('feelings').value;
  // API call
  // getWeatherData(baseURL,'94040,us&', apiKey)
  getWeatherData(baseURL,zipCode, apiKey)
  .then(function(data){
    console.log(data);
    // Add data to POST request
    postData('/addWeatherData', {temp:data.main.temp, date:newDate, feel:feeling, city:data.name, country:data.sys.country});
  })
  .then(function(data){
    updateUI()
  })
}

// API call
const getWeatherData = async (baseURL, zipCode, apiKey) => {
  const res = await fetch(baseURL+zipCode+apiKey);
  try {
    const data = await res.json();
    // Check if zip code is valid and city exists
    if (data.cod != '200'){
      throw Error(data.message)
    }
    document.getElementById('displayResult').innerText = 'Most Recent Entry:';
    document.getElementById('entryHolder').style.display = 'block';
    console.log('API Call getWeatherData' + data);
    return data;
  }catch(error) {
    // appropriately handle the error
    console.log("getWeatherData error", error);
    document.getElementById('entryHolder').style.display = 'none';
    document.getElementById('displayResult').innerText = 'Error: City not found, please enter a different zip code';

    return error;
  }
}

// POST request to our route in the file server.js file:
const postData = async ( url = '', data = {})=>{
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      // We want to manage our data as Json format
      'Content-Type': 'application/json',
    },
    // Body data type must match "Content-Type" header.
    // When sending data to a web server, the data has to be a string.
    body: JSON.stringify(data),
  });
    try {
      const newData = await response.json();
      console.log(newData);
      return newData;
    }catch(error) {
    console.log("error", error);
    }
}

// Updating UI
const updateUI = async () => {
  const request = await fetch('/journalData');
  try{
    const journalData = await request.json();
    console.log('updateUI', journalData);
    // Write updated data to DOM elements
    document.getElementById('city').innerHTML = 'City: ' + journalData[journalData.length - 1].city + ', ' + journalData[journalData.length - 1].country;
    document.getElementById('date').innerHTML = 'Date: ' + journalData[journalData.length - 1].date;
    document.getElementById('temp').innerHTML = 'Temperature: ' + Math.round(journalData[journalData.length - 1].temp) + ' degrees C°';
    document.getElementById('content').innerHTML = 'Feeling: ' + journalData[journalData.length - 1].feel;
  }catch(error){
    console.log("error", error);
  }
}