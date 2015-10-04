var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var itemSchema = new Schema({
	name: String,
	category: String,
	price: Number,
	Time: Date
	
}, { 
	minimize: false
});

var item = mongoose.model('item', itemSchema);