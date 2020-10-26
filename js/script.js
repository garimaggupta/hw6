
//Initialize an array to storage the list of cities from previous searches
if (typeof localStorage.searchCities === "undefined") {
  var cities = [];
} else {
  cities = JSON.parse(localStorage.getItem("searchCities"));
}

var citySelected = '';

//This function is called after webpage is loaded. 
// If user visits the website the first time only search bar will
// be displayed. If user has searched for cities previously then
// weather details of last searched city are displayed
$(document).ready(function () {
  if (typeof localStorage.curCity === "undefined") {
    $("#currentForecast").attr("class","row row-border hide");
    $("#5dayForecast").attr("class","row row-width hide");
  } else 
  {
    let citySelected = localStorage.getItem("curCity");
    loadWeather(citySelected);
}
});


// This function calls the OpenWeatherAPIs to get the weather data
// and process and display the data on the web page
function loadWeather(citySelected) {
   let url =
   // Call the weather endpoint to get the latitude and longitude 
   // of the selected city
     "https://api.openweathermap.org/data/2.5/weather?q=" +
     citySelected +
     "&appid=8adf747fec7e55a0b8cd80181043bd95";

   $.ajax({
     url: url,
     method: "GET",
   }).then(function (response) {
     let lat = response.coord.lat;
     let lon = response.coord.lon;
     // call the onecall endpoint to get the weather data for the selected city
     let url =
       "https://api.openweathermap.org/data/2.5/onecall?lat=" +
       lat +
       "&lon=" +
       lon +
       "&exclude=hourly,alerts,minutely&appid=8adf747fec7e55a0b8cd80181043bd95&units=imperial";
     $.ajax({
       url: url,
       method: "GET",
     }).then(function (response) {

       // Extract the date, temperate, humidity, windspeed and UV Index information
       // from API response object and display on the webpage
       let tempDate = new Date(response.current.dt * 1000).toLocaleDateString(
         "en-US"
       );
       let iconURL =
         "http://openweathermap.org/img/w/" +
         response.current.weather[0].icon +
         ".png";

       //Display City name is Weather Icon
       $("#curCity").html(
         citySelected + " (" + tempDate + ") <img src=" + iconURL + ">"
       );

       //Display Temperature
       $("#temp").html("Temperature: " + response.current.temp + "&deg; F");

       // Update the current UVIndex div background color based on UVIndex 
       // value falling into low, moderate or high
       let curUVIndex = response.current.uvi;
       if (parseFloat(curUVIndex) <= 2) {
         $("#uv-value").attr("class", "uvindex-low");
       } else if (parseFloat(curUVIndex) <= 5) {
         $("#uv-value").attr("class", "uvindex-moderate");
       } else {
         $("#uv-value").attr("class", "uvindex-high");
       }
       $("#uv-value").html(response.current.uvi);

       // Display Humidity
       $("#humidity").html("Humidity: " + response.current.humidity + "%");
        // Display Wind Speed
       $("#windSpeed").html(
         "Wind Speed: " + response.current.wind_speed + " MPH"
       );

       //Display Five day Forecast - Date, Temperature and Humidity
       tempDate = new Date(response.daily[1].dt * 1000).toLocaleDateString(
         "en-US"
       );

       $("#day1").html(tempDate);
       iconURL =
         "http://openweathermap.org/img/w/" +
         response.daily[1].weather[0].icon +
         ".png";
       $("#day1icon").html("<img src=" + iconURL + ">");
       $("#day1temp").html("Temp: " + response.daily[1].temp.day + "&deg; F");
       $("#day1humidity").html(
         "Humidity: " + response.daily[1].humidity + "%"
       );

       tempDate = new Date(response.daily[2].dt * 1000).toLocaleDateString(
         "en-US"
       );
       $("#day2").html(tempDate);
       iconURL =
         "http://openweathermap.org/img/w/" +
         response.daily[2].weather[0].icon +
         ".png";
       $("#day2icon").html("<img src=" + iconURL + ">");
       $("#day2temp").html("Temp: " + response.daily[2].temp.day + "&deg; F");
       $("#day2humidity").html(
         "Humidity: " + response.daily[2].humidity + "%"
       );

       tempDate = new Date(response.daily[3].dt * 1000).toLocaleDateString(
         "en-US"
       );
       $("#day3").html(tempDate);
       iconURL =
         "http://openweathermap.org/img/w/" +
         response.daily[3].weather[0].icon +
         ".png";
       $("#day3icon").html("<img src=" + iconURL + ">");
       $("#day3temp").html("Temp: " + response.daily[3].temp.day + "&deg; F");
       $("#day3humidity").html(
         "Humidity: " + response.daily[3].humidity + "%"
       );

       tempDate = new Date(response.daily[4].dt * 1000).toLocaleDateString(
         "en-US"
       );
       $("#day4").html(tempDate);
       iconURL =
         "http://openweathermap.org/img/w/" +
         response.daily[4].weather[0].icon +
         ".png";
       $("#day4icon").html("<img src=" + iconURL + ">");
       $("#day4temp").html("Temp: " + response.daily[4].temp.day + "&deg; F");
       $("#day4humidity").html(
         "Humidity: " + response.daily[4].humidity + "%"
       );

       tempDate = new Date(response.daily[5].dt * 1000).toLocaleDateString(
         "en-US"
       );
       $("#day5").html(tempDate);
       iconURL =
         "http://openweathermap.org/img/w/" +
         response.daily[5].weather[0].icon +
         ".png";
       $("#day5icon").html("<img src=" + iconURL + ">");
       $("#day5temp").html("Temp: " + response.daily[5].temp.day + "&deg; F");
       $("#day5humidity").html(
         "Humidity: " + response.daily[5].humidity + "%"
       );
     });
   });
   //Show the Div elements that will display the weather data
   $("#currentForecast").attr("class","row row-border show");
   $("#5dayForecast").attr("class","row row-width show");

   // Display the buttons with past searched cities
   renderButtons();
 }

// This function will add the current searched city to localstorage for 
// future retrieval 
$("#add-cities").on("click", function () {
  let curCity = search.value;
  if (curCity !== "") {
    localStorage.setItem("curCity", curCity);
    cities.push(curCity);
    localStorage.setItem("searchCities", JSON.stringify(cities));
  }
});

// Function for displaying past searched cities data
function renderButtons() {
  $("#past-cities-btn").empty();
  let cityArray = JSON.parse(localStorage.getItem("searchCities"));
  console.log("City Array " + cityArray);

  // Looping through the array of cities
  for (var i = 0; i < cityArray.length; i++) {
    var a = $("<button>");

    a.attr("data-name", cityArray[i]);
    a.attr("class", "btn btn-outline-secondary cities-btn");

    a.text(cityArray[i]);

    $("#past-cities-btn").append(a);
  }
}

//Search the weather when past cities button is clicked
$(document).on("click", ".cities-btn", function (event) {
  citySelected = $(this).attr("data-name");
  loadWeather(citySelected);
});
