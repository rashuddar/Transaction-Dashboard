const mongoose = require('mongoose');

const productTransactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    quantity: Number,
    timestamp: String,
});

const ProductTransaction = mongoose.model('ProductTransaction', productTransactionSchema);

module.exports = ProductTransaction;
