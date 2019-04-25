
/* 
    Name: Mel Nguyen & Matthew Lee
    Class: CSC337-001 
	Description: Final project, allows for users to upload, view golden hour pictures. Also
	allows them to enter a place in the US and it will display the time to golden hour.
*/

"use strict";

(function() {
	// globals are used for timers, to reset when button is clicked
	let timer;
	let currTime;
	
    window.onload = function() {
        document.getElementById("loc").onclick = findCoords;
		populatePhotos();
    };
	
	/** Adds all the photos from the server so the client can see them. **/
	function populatePhotos() {
		let url = "https://the-golden-hour.herokuapp.com?mode=pics";
		//let url = "http://localhost:3000?mode=pics";
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let data = JSON.parse(responseText);
				
				// Calculates the number of columns needed (rows)
				let numCols = Math.floor(data.length/3) + 1;
				if (data.length % 3 === 0) {
					numCols = data.length / 3;
				}
	
				let pointer = 0;
				for (let i = 0; i < numCols; i++) {
					let col = document.createElement("div");
					col.className = "col";
					for (let j = pointer; j < pointer+3; j++) {
						// Adds exactly 3 pictures to each col (row)
						if (data[j]){
							let obj = data[j];
							let pic = document.createElement("img");
							pic.src = "https://the-golden-hour.herokuapp.com/pics/" + obj["pic"];
							//pic.src = "./pics/" + obj["pic"];
							pic.addEventListener('click', function() {
								alert("Name: " + obj["name"] + ", Place: " + obj["place"]);
							});
							col.appendChild(pic);
						}
					}
					pointer += 3;
					document.getElementById("row").appendChild(col);
				}
		
			})
			.catch(function(err) {
				console.log(err);
			});

	}

	/** API to geocode - get the latitude and longitude based on input of text input. **/
    function findCoords() {
        let cityField = document.getElementById("city");
        let ddstate = document.getElementById("state");
        
        let city = cityField.value;
        let state = ddstate.options[ddstate.selectedIndex].value;
		if (city) {
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
    }

	/** API call to get sunset time based on a latitude and longitude. **/
    function getData(lat, lon) {
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
		let url = "https://api.sunrise-sunset.org/json?lat="+lat+"&lng="+lon+
		"&date="+date+"&formatted=0";

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);
                let sunset = json["results"]["sunset"];
                let sunsetDate = new Date(sunset);
                populateInfo(sunsetDate);
            });
    }

	/** Puts information about current time and when golden hour is in the main information div. **/
    function populateInfo(sunsetDate) {
        let sunsetTimeStr = getTime(sunsetDate);
		countdown(sunsetDate);
		
		document.getElementById('sun').innerHTML = "";
		let city = document.getElementById("city").value;
        let state = document.getElementById("state").value;
		document.getElementById('sun').innerHTML += "<h2>Golden Hour for " + city + ", " + state 
		+ "</h2>";
		document.getElementById('sun').innerHTML += "<p>Sunset Time: " + sunsetTimeStr + "</p>";
		printCurrTime();
    }
	
	/** Prints current time with a timer so it can countdown. **/
	function printCurrTime() {
		if (currTime) {
			clearInterval(currTime);
		}
		currTime = setInterval(function() {
			let currTimeStr = getTime(new Date());
			document.getElementById('curr').innerHTML = "<p>Current Time: " + currTimeStr + "</p>";
		}, 1000);
	}

	/** Returns a string of the current time. **/
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
	
	/** Sets the timer for the countdown until Golden Hour has come, **/
	function countdown(sunset) {
		if (timer) {
			clearInterval(timer);
		}
		timer = setInterval(function() {
			let print = document.getElementById("timer");
			let curr = new Date();
			changeBackground(curr);
			var distance = sunset - curr;
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			print.innerHTML = "Time till Golden Hour: " + hours + "h " + minutes + "m " + 
			seconds + "s ";

			// If the count down is finished, write some text 
			if (distance < 0) {
				clearInterval(timer);
				if (distance > -10) {
					document.getElementById("timer").innerHTML = "IT'S GOLDEN HOUR!";
				}
				else {
					document.getElementById("timer").innerHTML = 
					"Wait until tomorrow for Golden Hour!";
				}
			}
		}, 1000);
	}
	
	/** Changes the background color of our header depending on what the current time is. **/
	function changeBackground(time) {
		let currHour = time.getHours();
		let main = document.getElementById('main');
		if (currHour >= 6 && currHour < 11) {
			main.style.backgroundImage = "linear-gradient(#6dd5fa, #9aecdb, white)";
		}
		else if (currHour >= 11 && currHour < 16) {
			main.style.backgroundImage = "linear-gradient(#fceabb, #f8b500)";
		}
		else if (currHour >= 16 && currHour < 19) {
			main.style.backgroundImage = "linear-gradient(#FF512F, #f09819)";
		}
		else {
			main.style.backgroundImage = "linear-gradient(#C33764, #1d2671)";
		}
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