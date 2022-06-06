// Client side code - Udacity project weather journal app

/* Global Variables */
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) +'.'+ d.getDate()+'.'+ d.getFullYear();

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
  // Check zipcode before API call
  const zipCheck = /(?!00[02-5]|099|213|269|34[358]|353|419|42[89]|51[789]|529|53[36]|552|5[67]8|5[78]9|621|6[348]2|6[46]3|659|69[4-9]|7[034]2|709|715|771|81[789]|8[3469]9|8[4568]8|8[6-9]6|8[68]7|9[02]9|987)\d{5}/.test(zipCode);
  if (zipCheck) {
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
  else{
    zipError();
  }
}

// Error handling in case of wrong zipcode
function zipError(error = 'wrong zipcode'){
  console.log("getWeatherData error", error);
  document.getElementById('entryHolder').style.display = 'none';
  document.getElementById('displayResult').innerText = 'Error: City not found, please enter a different zip code';
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
    zipError(error);
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
  const request = await fetch('/all');
  try{
    const journalData = await request.json();
    console.log('updateUI', journalData);
    // Write updated data to DOM elements
    document.getElementById('city').innerHTML = 'City: ' + journalData.city + ', ' + journalData.country;
    document.getElementById('date').innerHTML = 'Date: ' + journalData.date;
    document.getElementById('temp').innerHTML = 'Temperature: ' + Math.round(journalData.temp) + ' degrees C°';
    document.getElementById('content').innerHTML = 'Feeling: ' + journalData.feel;
  }catch(error){
    console.log("error", error);
  }
}