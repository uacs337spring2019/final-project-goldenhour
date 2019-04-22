"use strict";

(function() {
    window.onload = function() {
        document.getElementById("loc").onclick = test;
    };

    function test() {
        let offset = new Date().getTimezoneOffset();
        console.log(offset);
    }

    function findCoords() {
        let cityField = document.getElementById("city");
        let ddstate = document.getElementById("state");
        
        let city = cityField.value;
        let state = ddstate.options[ddstate.selectedIndex].value;

        let url = "https://us1.locationiq.com/v1/search.php?key=eb122602cf386b&format=json" +
        "&state=" + state + "&city=" + city;

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);
                let lat = json[0]["lat"];
                let lon = json[0]["lon"];
                console.log(lat + " " + lon);
                getData(lat, lon);
                
            });
    }

    function getData(lat, lon) {
        let url = "https://api.sunrise-sunset.org/json?lat=" + lat +
        "&lng=" + lon;

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);
                console.log(json);
            });
    }

    /** Checks the status of data requests to the web service. It returns an error message if
     *  there is was a problem, specific messages for 410 and 404 errors with a general error
     *  otherwise. **/
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } 
        else if (response.status == 410) {
            return Promise.reject(new Error("410: There was no data found!"));
        } 
        else if (response.status == 404) {
            return Promise.reject(new Error("404: We couldn't find what you're looking for!"));
        }
        else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
})();