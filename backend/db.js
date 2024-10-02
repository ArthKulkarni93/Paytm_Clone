const mongoose = require('mongoose');
const { mongoURL } = require('./config');

try {
    mongoose.connect(mongoURL)
    .then(()=> {
        console.log('connected to db');
    })
} catch (error) {
    console.log('error in connecting db');
}

const user_Schema = new mongoose.Schema({
    email : String,
    firstname : String,
    lastname : String,
    password : String
})
const User = mongoose.model('user_Table',user_Schema);

const account_Schema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:User
    },
    balance : Number
})

const Account = mongoose.model('Account', account_Schema);

module.exports = {
    User,
    Account
}