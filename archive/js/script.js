document.addEventListener("DOMContentLoaded", function () {
    // Form validation
    let signupForm = document.getElementById("signupForm");
    let passwordField = document.getElementById("password");
    let confirmPasswordField = document.getElementById("confirmPassword");
    let yearSelect = document.getElementById("yearSelect");

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            let password = passwordField.value;
            let confirmPassword = confirmPasswordField.value;

            // Validate password match
            if (password !== confirmPassword) {
                confirmPasswordField.setCustomValidity("Passwords do not match.");
            } else {
                confirmPasswordField.setCustomValidity("");
            }

            // Bootstrap form validation
            if (!signupForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            signupForm.classList.add("was-validated");
        });
    }

    // Populate the year dropdown
    if (yearSelect) {
        let currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1990; i--) {
            let option = document.createElement("option");
            option.text = i;
            option.value = i;
            yearSelect.add(option);
        }
    }
});
