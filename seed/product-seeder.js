// To seed Data Run "node .\product-seeder.js" in terminal

var Product = require('../models/product');
const { exists } = require('../models/product');
var mongoose = require('mongoose')


const URI = 'mongodb+srv://samy123:samy123@tmcluster-qrtg7.mongodb.net/shopping?retryWrites=true&w=majority';
const OPTS = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(URI, OPTS, function (err) {
    if (err) { return console.log(err); }
});
var products = [
    new Product({
        imagePath: 'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1108&q=80',
        title: 'Camaro',
        description: 'this is a description camaro',
        price: 40
    }), new Product(
        {
            imagePath: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
            title: 'Mustang',
            description: 'this is a description for Mustang',
            price: 50
        }), new Product(
            {
                imagePath: 'https://www.mercedes-benz.com/en/classic/museum/mercedes-benz-500-e/_jcr_content/image/MQ6-12-image-20190114135819/classic-museum-begehrter-youngtimer_1180x763_v2-1180x763.jpeg',
                title: 'Mercedes-Benz',
                description: 'this is a description Mercedes-Benz',
                price: 60
            })]

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}
function exit() {

    mongoose.disconnect();
}