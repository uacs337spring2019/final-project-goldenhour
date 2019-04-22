"use strict";

(function() {
    window.onload = function() {
        
    };

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