// Work in Progress - Credit Card Validation
var CreditCard = require('credit-card');
var $form = $('#checkout-form');


console.log("wkjghewghkjehgjkegkje");
$form.submit(function (event) {

    var card = {
        cardType: 'VISA',
        number: $('#card-number').val(),
        expiryMonth: $('#card-expiry-month').val(),
        expiryYear: $('#card-expiry-year').val(),
        cvv: $('#card-cvc').val()
    };
    var validation = CreditCard.validate(card);
    console.log(validation.validCardNumber);

});

