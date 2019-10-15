//Server Side
const fetch = require("node-fetch");
var express = require("express");
var socket = require("socket.io");

// App Setup
var app = express();
var server = app.listen(4000, function () {
    console.log("listening to requests on port 4000")
});

//Client sees public folder
app.use(express.static('public'));

//Socket Setup
var io = socket(server);

//Needed Variables for better protection of data
var apiKey = "1868ff532a12f7795015bc33a64c2e97";
var half_url_API = "https://api.darksky.net/forecast/" + apiKey + "/";
var half_url_city = "https://eu1.locationiq.com/v1/reverse.php?key=d2c1d2b99010ab&normalizecity=1&lat=";
var half_url_search_city = "https://eu1.locationiq.com/v1/search.php?key=d2c1d2b99010ab&q=city,";

io.on("connection", function (socket) {
    console.log("made socket connection");

    //When Server recieves "urls" message...
    socket.on("urls", function (urls) {
        console.log("got urls for reverse geocoding & weather API");

        fetch(half_url_city + urls.url_city).then(
            (result) => {
                return result.json()
            }
        ).then((json) => {
                var cityname = json["address"]["city"] + ", " + json["address"]["country"];

                fetch(half_url_API + urls.url_API).then(
                    (result) => {
                        return result.json()
                    }
                ).then((json) => {
                        socket.emit("urls", {url_API: json, cityname: cityname});
                        console.log("sent url-data to client")
                    }
                ).catch((err) => console.log(err));
            }
        ).catch((err) => console.log(err));

    });


    socket.on("search_city", function (url_search_city, ackCallback) {
        console.log("got search-city request");

        fetch(half_url_search_city + url_search_city.url_searchCity).then(
            (result) => {
                return result.json()
            }
        ).then( (json) =>{
                console.log("sent lat&long to client");
                var searchLatLong = json[0]["lat"] + "," + json[0]["lon"];
                ackCallback(searchLatLong)
            }
        ).catch((err) => console.log(err));
    })
});

