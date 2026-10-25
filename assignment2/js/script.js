
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

    /* find booking inputs */
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


    /* get movie from url */
    var movieId = new URLSearchParams(window.location.search).get("movie");

    /* store selected movie and prices */
    let selectedMovie = null;
    let ticketPrices = null;

    /* load movie selected from another page */
    if (movieId) {
        movie.value = movieId;
    }

    /* run when movie dropdown changes */
    movie.onchange = movieChanged;

    function movieChanged() {

        /* clear old screening dates */
        screen.innerHTML = '<option value="">Choose a session</option>';

        selectedMovie = null;
        ticketPrices = null;

        /* reset price labels */
        document.getElementById("adult-label").textContent = "Adult";
        document.getElementById("student-label").textContent = "Student";
        document.getElementById("child-label").textContent = "Child";

        calculatePrice();

        if (movie.value != "") {
            getMovieData();
        }
    }


    /* get movie details from json */
    function getMovieData() {

        fetch("json/movies.json")
            .then(function(response) {

                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }

                return response.json();
            })
            .then(function(data) {

                /* match selected movie id */
                selectedMovie = data.movies.find(
                    m => m.id === movie.value
                );

                if (selectedMovie) {

                    /* get ticket prices for this movie */
                    ticketPrices = selectedMovie.ticketPrice;

                    /* show prices beside ticket types */
                    document.getElementById("adult-label").textContent =
                        "Adult - $" + ticketPrices.adult;

                    document.getElementById("student-label").textContent =
                        "Student - $" + ticketPrices.student;

                    document.getElementById("child-label").textContent =
                        "Child - $" + ticketPrices.child;

                    /* clear and add movie screening dates */
                    screen.innerHTML = '<option value="">Choose a session</option>';

                    for (var i = 0; i < selectedMovie.screenings.length; i++) {

                        screen.add(new Option(
                            selectedMovie.screenings[i].label,
                            selectedMovie.screenings[i].date
                        ));
                    }
                }

                calculatePrice();
            })
            .catch(function(error) {
                console.error("Error loading movie data:", error);
            });
    }


    /* load booking movie after functions are ready */
    if (movie.value != "") {
        getMovieData();
    }


    /* calculate ticket price */
    function calculatePrice() {

        /* wait until movie prices have loaded */
        if (ticketPrices == null) {
            totalPrice.textContent = "0.00";
            return;
        }

        var adultQty = Number(adult.value);
        var studentQty = Number(student.value);
        var childQty = Number(child.value);

        var total = (adultQty * ticketPrices.adult) +
                    (studentQty * ticketPrices.student) +
                    (childQty * ticketPrices.child);

        totalPrice.textContent = total.toFixed(2);
    }


    /* copy email to billing email */
    function copyEmail() {

        if (sameEmail.checked) {
            billingEmail.value = email.value;
        } else {
            billingEmail.value = "";
        }
    }


    /* show payment details */
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


    /* validate booking form */
    function validateBooking() {

        var errMsg = "";
        var result = true;

        var adultQty = Number(adult.value);
        var studentQty = Number(student.value);
        var childQty = Number(child.value);
        var totalTickets = adultQty + studentQty + childQty;

        /* customer and payment details */
        var name = document.getElementById("full-name").value;
        var phone = document.getElementById("phone").value;
        var cardType = document.getElementById("cardType").value;
        var cardNumber = document.getElementById("cardNumber").value;
        var voucherCode = document.getElementById("voucherCode").value;
        var voucherPattern = /^[0-9]{12}$/;

        /* validation patterns */
        var phonePattern = /^[0-9]{10,}$/;
        var cardPattern = /^[0-9]+$/;


        /* check movie and session */
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


        /* check ticket numbers */
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


        /* check customer details */
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


        /* check payment method */
        if (!voucher.checked && !online.checked) {
            errMsg += "<li>Please select a payment method.</li>";
        }

        /* check voucher code */
        if (voucher.checked) {
            if (!voucherCode.match(voucherPattern)) {
                errMsg += "<li>Voucher code must have 12 digits.</li>";
            }
        }


        /* check card details for online payment */
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


        /* check billing email */
        if (billingEmail.value == "") {
            errMsg += "<li>Billing email cannot be empty.</li>";
        }

        if (!billingEmail.validity.valid) {
            errMsg += "<li>Please enter a valid billing email.</li>";
        }


        /* display error messages */
        if (errMsg != "") {
            document.getElementById("bookingError").innerHTML = errMsg;
            result = false;
        } else {
            document.getElementById("bookingError").innerHTML = "";
        }

        return result;
    }


    /* connect booking events */
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

    /* validate registration */
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

        /* validation patterns */
        var usernamePattern = /^[a-zA-Z0-9_]+$/;
        var phonePattern = /^[0-9]{8,15}$/;
        var upperPattern = /[A-Z]/;
        var lowerPattern = /[a-z]/;
        var numberPattern = /[0-9]/;
        var specialPattern = /[^a-zA-Z0-9]/;


        /* check username */
        if (username.length < 5) {
            errMsg += "<li>Username must have at least 5 characters.</li>";
        }

        if (!username.match(usernamePattern)) {
            errMsg += "<li>Username can only contain letters, numbers and underscores.</li>";
        }


        /* check email */
        if (email.value == "") {
            errMsg += "<li>Email cannot be empty.</li>";
        }

        if (!email.validity.valid) {
            errMsg += "<li>Please enter a valid email.</li>";
        }


        /* check phone */
        if (!phone.match(phonePattern)) {
            errMsg += "<li>Phone must contain 8 to 15 numbers.</li>";
        }


        /* check password */
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


        /* check gender and genres */
        if (!gender) {
            errMsg += "<li>Please select a gender.</li>";
        }

        if (genres.length == 0) {
            errMsg += "<li>Please select a movie genre.</li>";
        }


        /* check country */
        if (country == "") {
            errMsg += "<li>Please select a country.</li>";
        }


        /* display error messages */
        if (errMsg != "") {
            document.getElementById("registerError").innerHTML = errMsg;
            result = false;
        } else {
            document.getElementById("registerError").innerHTML = "";
        }

        return result;
    }

    /* connect registration form */
    registerForm.onsubmit = validateRegister;
}


/* RECOMMENDATIONS PAGE */

var recommendForm = document.getElementById("recommendForm");

if (recommendForm) {

    
/* recommend a movie */
function recommendMovie() {

    var genre = document.getElementById("genre").value;
    var age = document.getElementById("ageGroup").value;
    var viewing = document.getElementById("viewing").value;

    /* stores the recommended movie */
    var movie = "";
    var movieName = "";

    /* action movies */
    if (genre == "action") {

        if (age == "adult" && (viewing == "solo" || viewing == "friends")) {
            movie = "sword";
            movieName = "Sword of the Stranger";
        }
        else {
            movie = "beast";
            movieName = "The Boy and the Beast";
        }
    }

    /* fantasy movies */
    if (genre == "fantasy") {

        if (age != "child" && (viewing == "solo" || viewing == "friends")) {
            movie = "mononoke";
            movieName = "Princess Mononoke";
        }
        else {
            movie = "howl";
            movieName = "Howl's Moving Castle";
        }
    }

    /* drama movies */
    if (genre == "drama") {
        movie = "wolf";
        movieName = "Wolf Children";
    }

    /* science fiction movies */
    if (genre == "scifi") {
        movie = "summer";
        movieName = "Summer Wars";
    }

    /* display recommended movie */
    if (movie == "") {
        document.getElementById("recommendText").textContent =
            "Sorry, we don't have a recommendation for your choices.";

        document.getElementById("recommendLink").hidden = true;
    }
    else {
        document.getElementById("recommendText").textContent =
            "We recommend " + movieName + " based on your choices.";

        document.getElementById("recommendLink").href =
            "booking.html?movie=" + movie;

        document.getElementById("recommendLink").hidden = false;
    }

    document.getElementById("recommendResult").hidden = false;

    return false;
}

    /* connect recommendation form */
    recommendForm.onsubmit = recommendMovie;
}
