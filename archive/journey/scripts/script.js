// Global Variables, Functions
//
function loadPartbyID(id, url, callback) { // Add a callback function
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (callback) {
                callback(); // Execute the callback after content is loaded
            }
        })
        .catch(error => console.error('Error loading webpart:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    loadPartbyID('bodyContainer', '../templates/flex-layout/base.html');
    
});



   