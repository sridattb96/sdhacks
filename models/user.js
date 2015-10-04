var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	mostExpName: String,
	mostExpPrice: Number,
	books: {
		avgTime: Number,
		lastPurchasedDate: Number,
		count: Number
	},
	toys: {
		avgTime: Number,
		lastPurchasedDate: Number,
		count: Number
	},
	electronics: {
		avgTime: Number,
		lastPurchasedDate: Number,
		count: Number
	},
	payments: {
		avgTime: Number,
		lastPurchasedDate: Number,
		count: Number
	},
	music: {
		avgTime: Number,
		lastPurchasedDate: Number,
		count: Number
	},
	travel: {
		avgTime: Number,
		lastPurchasedDate: Number,
		count: Number
	},

})

var User = mongoose.model('User', UserSchema);