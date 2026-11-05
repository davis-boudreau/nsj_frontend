//-- Load Header and Footer --//
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname; // Get the current page's path

  if (currentPage.includes('index.html') || currentPage === '/') {
      loadPart('header', 'header-index.html');
  } else if (currentPage.includes('myjourney.html')) {
      loadPart('header', 'header-rider.html');
  } else if (currentPage.includes('available-rides.html')) {
      loadPart('header', 'header-rider.html');
  } else {
      // Default header for other pages
      loadPart('header', 'header-index.html');
  }

  loadPart('footer', 'footer.html');
});

function loadPart(id, url) {
  fetch(url)
      .then(response => response.text())
      .then(data => {
          document.getElementById(id).innerHTML = data;
      });
}

//-- Login Form Validation --//
document.getElementById("loginForm").addEventListener("submit", function(event) {
    if (!this.checkValidity()) {
        event.preventDefault(); // Prevent form submission
        event.stopPropagation();
    }
    this.classList.add("was-validated"); // Add Bootstrap validation styles
});

document.getElementById("loginForm").addEventListener("submit", function(event) {
    if (!this.checkValidity()) {
        event.preventDefault(); // Prevent form submission
        event.stopPropagation();
    }
    this.classList.add("was-validated"); // Add Bootstrap validation styles
});

