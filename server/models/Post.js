const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    pay:{
        type: Number,
        required: true
    }, 
    email:{
        type: String,
        required: true,
    },
    venue:{
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    adminCheck:{
        type: String,
        default: "NotAccepted"
    }
});

module.exports = mongoose.model('Post', PostSchema)