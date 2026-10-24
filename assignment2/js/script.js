
/*
JavaScript Key Things to Remember

=       assign a value
==      compare values
!=      not equal
&&      AND
||      OR
!       NOT
++      add 1
+=      add to existing value
.length number of items
.value  value entered in a form
.checked checks a checkbox or radio button
*/


/* BOOKING PAGE */

var bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    /* Find booking inputs */
    var movie = document.getElementById("movie");
    var screen = document.getElementById("screen");

    var adult = document.getElementById("adult-tickets");
    var student = document.getElementById("student-tickets");
    var child = document.getElementById("child-tickets");
    var totalPrice = document.getElementById("totalPrice");

    var email = document.getElementById("email");
    var billingEmail = document.getElementById("billingEmail");
    var sameEmail = document.getElementById("sameEmail");

    var voucher = document.getElementById("voucher");
    var online = document.getElementById("online");
    var voucherDetails = document.getElementById("voucherDetails");
    var cardDetails = document.getElementById("cardDetails");


    /* Get movie from URL */
    var movieId = new URLSearchParams(window.location.search).get("movie");

    if (movieId) {
        movie.value = movieId;
    }


    /* Load movie dates from JSON */
    fetch("json/movies.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            function showScreen() {

                screen.innerHTML = '<option value="">Choose a session</option>';

                for (var i = 0; i < data.movies.length; i++) {

                    if (data.movies[i].id == movie.value) {

                        var dates = data.movies[i].screenings;

                        for (var j = 0; j < dates.length; j++) {

                            if (new Date(dates[j].date) > new Date()) {
                                screen.add(new Option(dates[j].label, dates[j].date));
                            }
                        }
                    }
                }
            }

            showScreen();
            movie.onchange = showScreen;
        });


    /* Calculate ticket price */
    function calculatePrice() {

        var adultQty = Number(adult.value);
        var studentQty = Number(student.value);
        var childQty = Number(child.value);

        var total = (adultQty * 18) +
                    (studentQty * 15) +
                    (childQty * 12);

        totalPrice.textContent = total.toFixed(2);
    }


    /* Copy email to billing email */
    function copyEmail() {

        if (sameEmail.checked) {
            billingEmail.value = email.value;
        } else {
            billingEmail.value = "";
        }
    }


    /* Show payment details */
    function showPayment() {

        if (voucher.checked) {
            voucherDetails.hidden = false;
            cardDetails.hidden = true;
        }

        if (online.checked) {
            cardDetails.hidden = false;
            voucherDetails.hidden = true;
        }
    }


    /* Validate booking form */
    function validateBooking() {

        var errMsg = "";
        var result = true;

        var adultQty = Number(adult.value);
        var studentQty = Number(student.value);
        var childQty = Number(child.value);
        var totalTickets = adultQty + studentQty + childQty;

        var name = document.getElementById("full-name").value;
        var phone = document.getElementById("phone").value;
        var cardType = document.getElementById("cardType").value;
        var cardNumber = document.getElementById("cardNumber").value;

        var phonePattern = /^[0-9]{10,}$/;
        var cardPattern = /^[0-9]+$/;


        /* Check movie and session */
        if (movie.value == "") {
            errMsg += "<li>Please select a movie.</li>";
        }

        if (screen.value == "") {
            errMsg += "<li>Please select a session.</li>";
        }

        if (screen.value != "") {
            if (new Date(screen.value) <= new Date()) {
                errMsg += "<li>Session must be in the future.</li>";
            }
        }


        /* Check ticket numbers */
        if (totalTickets <= 0) {
            errMsg += "<li>Please select at least one ticket.</li>";
        }

        if (adult.value == "" || student.value == "" || child.value == "") {
            errMsg += "<li>Please enter all ticket quantities.</li>";
        }

        if (adultQty < 0) {
            errMsg += "<li>Adult tickets cannot be negative.</li>";
        }

        if (studentQty < 0) {
            errMsg += "<li>Student tickets cannot be negative.</li>";
        }

        if (childQty < 0) {
            errMsg += "<li>Child tickets cannot be negative.</li>";
        }

        if (adultQty % 1 != 0 || studentQty % 1 != 0 || childQty % 1 != 0) {
            errMsg += "<li>Ticket numbers must be whole numbers.</li>";
        }


        /* Check customer details */
        if (name.trim() == "") {
            errMsg += "<li>Please enter your full name.</li>";
        }

        if (email.value == "") {
            errMsg += "<li>Email cannot be empty.</li>";
        }

        if (!email.validity.valid) {
            errMsg += "<li>Please enter a valid email.</li>";
        }

        if (!phone.match(phonePattern)) {
            errMsg += "<li>Phone must contain at least 10 numbers.</li>";
        }


        /* Check payment method */
        if (!voucher.checked && !online.checked) {
            errMsg += "<li>Please select a payment method.</li>";
        }


        /* Check card details for online payment */
        if (online.checked) {

            if (cardType == "") {
                errMsg += "<li>Please select a card type.</li>";
            }

            if (!cardNumber.match(cardPattern)) {
                errMsg += "<li>Card number must contain numbers only.</li>";
            }

            if (cardType == "amex") {
                if (cardNumber.length != 15) {
                    errMsg += "<li>Amex must have 15 digits.</li>";
                }
            }

            if (cardType == "visa" || cardType == "mastercard") {
                if (cardNumber.length != 16) {
                    errMsg += "<li>Visa and Mastercard must have 16 digits.</li>";
                }
            }
        }


        /* Check billing email */
        if (billingEmail.value == "") {
            errMsg += "<li>Billing email cannot be empty.</li>";
        }

        if (!billingEmail.validity.valid) {
            errMsg += "<li>Please enter a valid billing email.</li>";
        }


        /* Display error messages */
        if (errMsg != "") {
            document.getElementById("bookingError").innerHTML = errMsg;
            result = false;
        } else {
            document.getElementById("bookingError").innerHTML = "";
        }

        return result;
    }


    /* Connect booking events */
    adult.oninput = calculatePrice;
    student.oninput = calculatePrice;
    child.oninput = calculatePrice;

    sameEmail.onclick = copyEmail;

    email.oninput = function() {
        if (sameEmail.checked) {
            billingEmail.value = email.value;
        }
    };

    voucher.onclick = showPayment;
    online.onclick = showPayment;

    bookingForm.onsubmit = validateBooking;

    calculatePrice();
}


/* REGISTRATION PAGE */

var registerForm = document.getElementById("registerForm");

if (registerForm) {

    /* Validate registration */
    function validateRegister() {

        var username = document.getElementById("username").value;
        var email = document.getElementById("regEmail");
        var phone = document.getElementById("regPhone").value;
        var pwd1 = document.getElementById("password").value;
        var pwd2 = document.getElementById("confirmPassword").value;
        var country = document.getElementById("country").value;

        var gender = document.querySelector('input[name="gender"]:checked');
        var genres = document.querySelectorAll('input[name="genres"]:checked');

        var errMsg = "";
        var result = true;

        /* Validation patterns */
        var usernamePattern = /^[a-zA-Z0-9_]+$/;
        var phonePattern = /^[0-9]{8,15}$/;
        var upperPattern = /[A-Z]/;
        var lowerPattern = /[a-z]/;
        var numberPattern = /[0-9]/;
        var specialPattern = /[^a-zA-Z0-9]/;


        /* Check username */
        if (username.length < 5) {
            errMsg += "<li>Username must have at least 5 characters.</li>";
        }

        if (!username.match(usernamePattern)) {
            errMsg += "<li>Username can only contain letters, numbers and underscores.</li>";
        }


        /* Check email */
        if (email.value == "") {
            errMsg += "<li>Email cannot be empty.</li>";
        }

        if (!email.validity.valid) {
            errMsg += "<li>Please enter a valid email.</li>";
        }


        /* Check phone */
        if (!phone.match(phonePattern)) {
            errMsg += "<li>Phone must contain 8 to 15 numbers.</li>";
        }


        /* Check password */
        if (pwd1.length < 10) {
            errMsg += "<li>Password must have at least 10 characters.</li>";
        }

        if (!pwd1.match(upperPattern)) {
            errMsg += "<li>Password needs an uppercase letter.</li>";
        }

        if (!pwd1.match(lowerPattern)) {
            errMsg += "<li>Password needs a lowercase letter.</li>";
        }

        if (!pwd1.match(numberPattern)) {
            errMsg += "<li>Password needs a number.</li>";
        }

        if (!pwd1.match(specialPattern)) {
            errMsg += "<li>Password needs a special character.</li>";
        }

        if (pwd1 != pwd2) {
            errMsg += "<li>Passwords do not match.</li>";
        }


        /* Check gender and genres */
        if (!gender) {
            errMsg += "<li>Please select a gender.</li>";
        }

        if (genres.length == 0) {
            errMsg += "<li>Please select a movie genre.</li>";
        }


        /* Check country */
        if (country == "") {
            errMsg += "<li>Please select a country.</li>";
        }


        /* Display error messages */
        if (errMsg != "") {
            document.getElementById("registerError").innerHTML = errMsg;
            result = false;
        } else {
            document.getElementById("registerError").innerHTML = "";
        }

        return result;
    }

    /* Connect registration form */
    registerForm.onsubmit = validateRegister;
}


/* RECOMMENDATIONS PAGE */

var recommendForm = document.getElementById("recommendForm");

if (recommendForm) {

    /* Recommend a movie */
    function recommendMovie() {

        var genre = document.getElementById("genre").value;
        var age = document.getElementById("ageGroup").value;
        var viewing = document.getElementById("viewing").value;

        var movie = "howl";
        var movieName = "Howl's Moving Castle";


        /* Check preferences */
        if (genre == "" || age == "" || viewing == "") {
            alert("Please select all three preferences.");
            return false;
        }


        /* Choose movie by genre */
        if (genre == "action") {
            movie = "beast";
            movieName = "The Boy and the Beast";
        }

        if (genre == "fantasy") {
            movie = "howl";
            movieName = "Howl's Moving Castle";
        }

        if (genre == "drama") {
            movie = "wolf";
            movieName = "Wolf Children";
        }

        if (genre == "scifi") {
            movie = "summer";
            movieName = "Summer Wars";
        }


        /* Adult recommendations */
        if (age == "adult" && viewing == "solo") {

            if (genre == "action") {
                movie = "sword";
                movieName = "Sword of the Stranger";
            }

            if (genre == "fantasy") {
                movie = "mononoke";
                movieName = "Princess Mononoke";
            }
        }


        /* Family recommendations */
        if (viewing == "family") {

            if (genre == "fantasy") {
                movie = "howl";
                movieName = "Howl's Moving Castle";
            }

            if (genre == "drama") {
                movie = "wolf";
                movieName = "Wolf Children";
            }
        }


        /* Display recommended movie */
        document.getElementById("recommendText").textContent =
            "We recommend " + movieName + " based on your choices.";

        document.getElementById("recommendLink").href =
            "booking.html?movie=" + movie;

        document.getElementById("recommendResult").hidden = false;

        return false;
    }

    /* Connect recommendation form */
    recommendForm.onsubmit = recommendMovie;
}
