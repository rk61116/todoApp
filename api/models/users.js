const mongoose = require('mongoose');
const shortId = require('shortid');

const userSchema = new mongoose.Schema({
    _id:{ 
        type: String, 
        default: shortId.generate
    },
    firstName: { 
        type: String
    },
    lastName: { 
        type: String
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String, 
        required: true
    },
    gender:{
        type:String,
        enum: ["Male", "Female"],
        required: true,
    },
    status: {
        type: String,
        enum: ["Active", "In-Active"],
        default: "Active",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
},{
    strict: false
});

module.exports = mongoose.model('users', userSchema);