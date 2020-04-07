const mongoose = require('mongoose');
const shortId = require('shortid');

const todoSchema = new mongoose.Schema({
    _id:{
        type:String,
        default: shortId.generate
    },
    todo:{
        type: String,
        required:true
    },
    status:{
        type: Boolean,
        default:false
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    isDeletedBy:{
        type: String
    },
    isDeletedAt:{
        type: Date
    },
    createdBy:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    updatedBy:{
        type:String
    },
    updatedAt:{
        type:Date
    }
});

module.exports = mongoose.model('todos', todoSchema);