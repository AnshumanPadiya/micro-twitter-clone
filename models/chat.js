const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({

    content: {
        type: String,
        trim: true,
        required: true
    },

    user: {
        type: String
    }

}, {timestamps: true});

const chat = mongoose.model('Chat', chatSchema);

module.exports = chat;