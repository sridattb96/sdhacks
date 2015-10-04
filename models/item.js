var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var ItemSchema = new Schema({
	name: String,
	merchant: String,
	category: String,
	price: Number,
	time: String
	
});

var Item = mongoose.model('Item', ItemSchema);