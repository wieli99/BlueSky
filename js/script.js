// DONT FORGET WINTER / SUMMER TIME, THERE IS AN OFFSET JSON PAR IN API - ITS DEPRECATED.!!----------------------------------------------------------------

if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(callAPI)
}

function callAPI(gpsdata){
    console.log(gpsdata);
    // Set Variables for API URL
    var apiKey = "1868ff532a12f7795015bc33a64c2e97";
    var exclude = "?exclude=minutely,alerts,flags";
    var unit = "&units=si";
    var lat = gpsdata.coords.latitude;
    var long = gpsdata.coords.longitude;

    var url_API = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + exclude + unit;

    var url_city = "http://api.ipstack.com/5.44.208.80?access_key=dd231fb7b7b0f552554b4ed325b659a2&format=1";

    fetch(url_city).then(
        (result) => {
            return result.json()
        }
    ).then( (json) =>{
            var cityname = json["city"]
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
    }

function interpretData(data, cityname) {
    console.log(data);
    //Most important data
    var daily = data["daily"];
    var daily_data_list = daily["data"];
    var hourly = data["hourly"];
    var hourly_data_list = hourly["data"];

    //additional data
    var precip_type = "No precipitation expected";
    if (daily_data_list[0]["precipType"] != null){
        precip_type = parseInt(daily_data_list[0]["precipProbability"] * 100).toString() + "% chance of " + daily_data_list[0]["precipType"] + " today";
    }

    //Data for Week Overview Daynames
    var now = new Date();
    var days = ['Sun', 'Mon','Tue','Wed','Thu','Fri','Sat'];
    var week_abbr = [];
    for (i=0; i<7; i++){
        week_abbr[i] = days[((now.getDay()+i)%7)]
    }
    // Current Date
    var fulldays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dayName = fulldays[now.getDay()];
    var monName = months[now.getMonth()];



    // Data for Overview
    document.getElementById("curdate").innerHTML = dayName + " " + now.getDate() + ". " + monName;
    document.getElementById("cityname").innerHTML = cityname; // Needs to be adjusted! -------------------------------------------------------------------
    document.getElementById("dayicon").src = "BlueSkyIcons/" + hourly_data_list[2]["icon"] + ".png";
    document.getElementById("shortsummary").innerHTML = hourly_data_list[2]["summary"];
    document.getElementById("overview-feel").innerHTML = "Feels Like " + Math.round(hourly_data_list[2]["apparentTemperature"], 1).toString() + "°C";
    document.getElementById("overview-actual").innerHTML = "Actual " + Math.round(hourly_data_list[2]["temperature"], 1).toString() + "°C";
    document.getElementById("overview-precip").innerHTML = precip_type;
    document.getElementById("summary").innerHTML = hourly["summary"];

    // Data for Week Preview
    document.getElementById("shorticons-1").src = "BlueSkyIcons/" + hourly_data_list[2]["icon"] + ".png";
    document.getElementById("shorticons-2").src = "BlueSkyIcons/" + daily_data_list[1]["icon"] + ".png";
    document.getElementById("shorticons-3").src = "BlueSkyIcons/" + daily_data_list[2]["icon"] + ".png";
    document.getElementById("shorticons-4").src = "BlueSkyIcons/" + daily_data_list[3]["icon"] + ".png";
    document.getElementById("shorticons-5").src = "BlueSkyIcons/" + daily_data_list[4]["icon"] + ".png";
    document.getElementById("shorticons-6").src = "BlueSkyIcons/" + daily_data_list[5]["icon"] + ".png";

    document.getElementById("weekname-1").innerHTML = week_abbr[1];
    document.getElementById("weekname-2").innerHTML = week_abbr[2];
    document.getElementById("weekname-3").innerHTML = week_abbr[3];
    document.getElementById("weekname-4").innerHTML = week_abbr[4];
    document.getElementById("weekname-5").innerHTML = week_abbr[5];
    document.getElementById("weekname-6").innerHTML = week_abbr[6];

    document.getElementById("weektexts-1").innerHTML = daily_data_list[1]["summary"];
    document.getElementById("weektexts-2").innerHTML = daily_data_list[2]["summary"];
    document.getElementById("weektexts-3").innerHTML = daily_data_list[3]["summary"];
    document.getElementById("weektexts-4").innerHTML = daily_data_list[4]["summary"];
    document.getElementById("weektexts-5").innerHTML = daily_data_list[5]["summary"];
    document.getElementById("weektexts-6").innerHTML = daily_data_list[6]["summary"];

    document.getElementById("weektemps-1").innerHTML = Math.round(daily_data_list[1]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[1]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-2").innerHTML = Math.round(daily_data_list[2]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[2]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-3").innerHTML = Math.round(daily_data_list[3]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[3]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-4").innerHTML = Math.round(daily_data_list[4]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[4]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-5").innerHTML = Math.round(daily_data_list[5]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[5]["temperatureHigh"]) + "°C";
    document.getElementById("weektemps-6").innerHTML = Math.round(daily_data_list[6]["temperatureLow"]) + "°C - " + Math.round(daily_data_list[6]["temperatureHigh"]) + "°C";

    // used for humidity graph
    /*
    var daily_hum_list = [8];
    for(var i=0; i<8; i++){
        daily_hum_list[i] = daily_data_list[i]["humidity"] * 100;
    }
    console.log(daily_hum_list)
    */

}