var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var itemSchema = new Schema({
	name: String,
	merchant: String,
	category: String,
	price: Number,
	time: Date
	
}, { 
	minimize: false
});

var Item = mongoose.model('Item', itemSchema);