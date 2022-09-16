const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    messageId: {
        required: true,
        type: String
    },
    fileName: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('kafkadetail', dataSchema)
