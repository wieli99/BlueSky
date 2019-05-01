//TODO: Die Zeitumstellung wird nicht berücksichtigt, die hourly_data_list hat an Stelle [0] UTC+1 und an Stelle [1] UTC+2
var mymap;
var isPainted = false;
var weatherChart;
var tempChart;
var humChart;

if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(callAPI)
}

function callAPI(gpsdata){
    console.log(gpsdata);
    if (typeof gpsdata != "string"){ //on refresh the posiion object is different
        var lat = gpsdata.coords.latitude;
        var long = gpsdata.coords.longitude;
    } else {
        var lat = gpsdata.split(",")[0];
        var long = gpsdata.split(",")[1];
    }
    // Set Variables for API URL
    var apiKey = "1868ff532a12f7795015bc33a64c2e97";
    var exclude = "?exclude=minutely,alerts,flags";
    var unit = "&units=si";


    var url_API = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + exclude + unit;
    var url_city = "https://eu1.locationiq.com/v1/search.php?key=d2c1d2b99010ab&q=" + lat + "," + long + "&format=json";

    fetch(url_city).then(
        (result) => {
            return result.json()
        }
    ).then( (json) =>{
            var cityname = json[0]["display_name"].split(",")[3] + ", " + json[0]["display_name"].split(",")[json[0]["display_name"].split(",").length-1];

            fetch(url_API).then(
                (result) => {
                    return result.json()
                }
            ).then( (json) =>{
                    interpretData(json, cityname)
                }
            ).catch((err) => console.log(err));
        }
    ).catch((err) => console.log(err));

    showMap(gpsdata);
    }

function interpretData(data, cityname) {
    console.log(data);
    //Most important data
    var daily = data["daily"];
    var daily_data_list = daily["data"];
    var hourly = data["hourly"];
    var hourly_data_list = hourly["data"];

    //Precip data
    var precip_type = "No precipitation expected";
    if (daily_data_list[1]["precipType"] != null) {
        precip_type = parseInt(daily_data_list[1]["precipProbability"] * 100).toString() + "% chance of " + daily_data_list[1]["precipType"] + " today";
    }

    //Data for Week Overview Daynames
    var now = new Date();
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var week_abbr = [];
    for (i = 0; i < 7; i++) {
        week_abbr[i] = days[((now.getDay() + i) % 7)]
    }
    // Current Date
    var fulldays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dayName = fulldays[now.getDay()];
    var monName = months[now.getMonth()];


    // Set Placeholder for Searchfield at bottom
    document.getElementById("searchcityname").placeholder = cityname.split(',')[0];

    // Data for Overview
    document.getElementById("curdate").innerHTML = dayName + " " + now.getDate() + ". " + monName;
    document.getElementById("cityname").innerHTML = cityname; // Needs to be adjusted! -------------------------------------------------------------------
    document.getElementById("dayicon").src = "BlueSkyIcons/" + hourly_data_list[0]["icon"] + ".png";
    document.getElementById("shortsummary").innerHTML = hourly_data_list[0]["summary"];
    document.getElementById("overview-feel").innerHTML = "Feels Like " + Math.round(hourly_data_list[0]["apparentTemperature"], 1).toString() + "°C";
    document.getElementById("overview-actual").innerHTML = "Actual " + Math.round(hourly_data_list[0]["temperature"], 1).toString() + "°C";
    document.getElementById("overview-precip").innerHTML = precip_type;
    document.getElementById("summary").innerHTML = hourly["summary"];

    // Data for Week Preview
    document.getElementById("shorticons-1").src = "BlueSkyIcons/" + daily_data_list[2]["icon"] + ".png";
    document.getElementById("shorticons-2").src = "BlueSkyIcons/" + daily_data_list[3]["icon"] + ".png";
    document.getElementById("shorticons-3").src = "BlueSkyIcons/" + daily_data_list[4]["icon"] + ".png";
    document.getElementById("shorticons-4").src = "BlueSkyIcons/" + daily_data_list[5]["icon"] + ".png";
    document.getElementById("shorticons-5").src = "BlueSkyIcons/" + daily_data_list[6]["icon"] + ".png";
    document.getElementById("shorticons-6").src = "BlueSkyIcons/" + daily_data_list[7]["icon"] + ".png";

    document.getElementById("weekname-1").innerHTML = week_abbr[1];
    document.getElementById("weekname-2").innerHTML = week_abbr[2];
    document.getElementById("weekname-3").innerHTML = week_abbr[3];
    document.getElementById("weekname-4").innerHTML = week_abbr[4];
    document.getElementById("weekname-5").innerHTML = week_abbr[5];
    document.getElementById("weekname-6").innerHTML = week_abbr[6];

    document.getElementById("weektexts-1").innerHTML = daily_data_list[2]["summary"];
    document.getElementById("weektexts-2").innerHTML = daily_data_list[3]["summary"];
    document.getElementById("weektexts-3").innerHTML = daily_data_list[4]["summary"];
    document.getElementById("weektexts-4").innerHTML = daily_data_list[5]["summary"];
    document.getElementById("weektexts-5").innerHTML = daily_data_list[6]["summary"];
    document.getElementById("weektexts-6").innerHTML = daily_data_list[7]["summary"];

    document.getElementById("weektemps-1").innerHTML = Math.round(daily_data_list[2]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[2]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-2").innerHTML = Math.round(daily_data_list[3]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[3]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-3").innerHTML = Math.round(daily_data_list[4]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[4]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-4").innerHTML = Math.round(daily_data_list[5]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[5]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-5").innerHTML = Math.round(daily_data_list[6]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[6]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-6").innerHTML = Math.round(daily_data_list[7]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[7]["temperatureHigh"]) + "°C";


    //The Weather Data for next 24 hours, for the Timeline
    var hourly_weather_list = []
    for (i = 0; i < 25; i++) {
        if (hourly_data_list[i]["icon"] == "clear-day" || hourly_data_list[i]["icon"] == "clear-night"){
            hourly_weather_list[i] = ("clear")
        } else if (hourly_data_list[i]["icon"] == "partly-cloudy-day" || hourly_data_list[i]["icon"] == "partly-cloudy-night"){
            hourly_weather_list[i] = ("cloudy")
        } else {
            hourly_weather_list[i] = (hourly_data_list[i]["icon"])
        }
    }

    // Maps the weather data to ints, for easier handling in vhart
    for (i=0; i<hourly_weather_list.length; i++) {
        if (hourly_weather_list[i] == 'clear')
            hourly_weather_list[i] = '1';
        if (hourly_weather_list[i] == 'cloudy')
            hourly_weather_list[i] = '2';
        if (hourly_weather_list[i] == 'wind')
            hourly_weather_list[i] = '3';
        if (hourly_weather_list[i] == 'fog')
            hourly_weather_list[i] = '4';
        if (hourly_weather_list[i] == 'rain')
            hourly_weather_list[i] = '5';
        if (hourly_weather_list[i] == 'snow')
            hourly_weather_list[i] = '6';
        if (hourly_weather_list[i] == 'sleet')
            hourly_weather_list[i] = '7';
    }

    //Temperature for TempChart
    var hourly_temp_list = []
    for (i=0; i<48; i++){
        hourly_temp_list[i] = hourly_data_list[i+1]["temperature"];
    }

    //Humidity for HumChart
    var hourly_hum_list = []
    for (i=0; i<48; i++){
        hourly_hum_list[i] = hourly_data_list[i+1]["humidity"]*100;
    }
    //Prediction to fill Chart
    hourly_hum_list[48] = hourly_hum_list[47] - (hourly_hum_list[46] - hourly_hum_list[47]);
    hourly_temp_list[48] = hourly_temp_list[47] - (hourly_temp_list[46] - hourly_temp_list[47]);

    //The next 14 hours
    curhour = new Date().getHours();
    nexthours = []
    for (i=0; i<25; i++){
        nexthours[i] = (curhour + i) % 24;
    }

    //Destroys Previous Charts
    if (isPainted){
        weatherChart.destroy();
        tempChart.destroy();
        humChart.destroy();
    }

    //To fix Refresh Bug
    isPainted = true;


    //Weather Chart
    var ctx = document.getElementById('weatherChart').getContext('2d');
    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: nexthours,
            datasets: [{
                label: "Weather Condition over next 24 hours",
                data: hourly_weather_list,
                backgroundColor: 'rgba(63, 81, 181, 1)',
                borderColor: 'rgba(63, 81, 181, 1)',
                borderWidth: '5',
                pointRadius: '0',
                pointHoverRadius: '5',
                fill: false,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            var conditions = ["", "Clear", "Cloudy", "Wind", "Fog", "Rain", "Snow", "Sleet"];
                            return conditions[value];
                        },
                        fontSize: 18
                    }
                }]
            }
        }
    });

    //Temperature Chart
    var tctx = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(tctx, {
        type: 'line',
        data: {
            labels: nexthours,
            datasets: [{
                label: "Temperature over next 24 hours",
                data: hourly_temp_list,
                backgroundColor: 'rgba(239, 108, 0, 1)',
                borderColor: 'rgba(239, 108, 0, 1)',
                borderWidth: '5',
                pointRadius: '0',
                pointHoverRadius: '5',
                fill: false,
            },
            {
                label: "Temperature Tomorrow",
                data: hourly_temp_list.slice(24, 49),
                backgroundColor: 'rgba(253, 216, 53, 1)',
                borderColor: 'rgba(253, 216, 53, 1)',
                borderWidth: '5',
                pointRadius: '0',
                pointHoverRadius: '5',
                fill: false,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return value + "°C";
                        }
                    }
                }]
            }
        }
    });


    //Humidity Chart
    var hctx = document.getElementById('humChart').getContext('2d');
    humChart = new Chart(hctx, {
        type: 'line',
        data: {
            labels: nexthours,
            datasets: [{
                label: "Humidity over next 24 hours",
                data: hourly_hum_list,
                backgroundColor: 'rgba(129, 200, 260, 1)',
                borderColor: 'rgba(129, 200, 260, 1)',
                borderWidth: '5',
                pointRadius: '0',
                pointHoverRadius: '5',
                fill: false,
            },
                {
                    label: "Humidity Tomorrow",
                    data: hourly_hum_list.slice(24, 49),
                    backgroundColor: 'rgba(0, 185, 200, 1)',
                    borderColor: 'rgba(0, 185, 200, 1)',
                    borderWidth: '5',
                    pointRadius: '0',
                    pointHoverRadius: '5',
                    fill: false,
                }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return value + "%";
                        }
                    }
                }]
            }
        }
    });

    // To search when Enter is hit
    document.getElementById('searchcityname').onkeydown = function(event) {
        if (event.keyCode == 13) {
            searchForCity();
        }
    }
}

function showMap(position) {
    if (typeof mymap !== "undefined"){ //onl< remove previous maps
        mymap.remove();
    }
    if (typeof position == "string"){ //on refresh the posiion object is different
        mymap = L.map('mapid').setView([position.split(",")[0], position.split(",")[1]], 13);
    } else {
        mymap = L.map('mapid').setView([position.coords.latitude, position.coords.longitude], 13); //Koordinaten und Zoom Level (Leere Box)
    }

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', { // Fügt Kartengraphik ein
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets', //satellite
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    }).addTo(mymap);
    markPosition(position)
}

function markPosition(position) {
    if (typeof position == "string"){ //on refresh the posiion object is different
        var marker = L.marker([position.split(",")[0], position.split(",")[1]]).addTo(mymap);
    } else {
        var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap); //Fügt marker an Koordinaten hinzu
    }
}

function searchForCity() {
    var searchCityname = document.getElementById("searchcityname").value.toLowerCase();

    var url_searchCity = "https://eu1.locationiq.com/v1/search.php?key=d2c1d2b99010ab&q=" + searchCityname + "&format=json";

    fetch(url_searchCity).then(
        (result) => {
            return result.json()
        }
    ).then( (json) =>{
        var searchLatLong = json[0]["lat"] + "," + json[0]["lon"];
        callAPI(searchLatLong)
        }
    ).catch((err) => console.log(err));
}