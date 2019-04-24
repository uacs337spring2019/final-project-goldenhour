"use strict";

(function() {
    window.onload = function() {
        document.getElementById("loc").onclick = findCoords;
    };

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
                getData(lat, lon);
            });
    }

    function getData(lat, lon) {
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
        let url = "https://api.sunrise-sunset.org/json?lat="+lat+"&lng="+lon+"&date="+date+"&formatted=0";

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);
                let sunset = json["results"]["sunset"];
                let sunsetDate = new Date(sunset);

                populateInfo(sunsetDate);
            });
    }

    function populateInfo(sunsetDate) {
        let sunsetTimeStr = getTime(sunsetDate);
        let currTimeStr = getTime(new Date());

        console.log(sunsetTimeStr);
        console.log(currTimeStr);

        // TODO: Matthew, you can put these in the content, I was thinking about using some big 
        // ass font to fill out the space.
    }

    function getTime(date) {
        date.toString();

        let hr = parseInt(date.getHours());
        let min = parseInt(date.getMinutes());
        let sec = parseInt(date.getSeconds());
        
        let meridiem = "AM";
        if (hr > 12) {
            meridiem = "PM";
            hr -= 12;
        }
        if (min < 10) {
            min = '0'+min;
        }
        if (sec < 10) {
            sec = '0'+sec;
        }

        let time = hr+':'+min+':'+sec+' '+meridiem;

        return time;
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