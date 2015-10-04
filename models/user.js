var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	mostExpName: String,
	mostExpPrice: Number,
	books: {
		avgTime: Number,
		lastPurchasedDate: Number
	},
	toys: {
		avgTime: Number,
		lastPurchasedDate: Number
	},
	electronics: {
		avgTime: Number,
		lastPurchasedDate: Number
	},
	payments: {
		avgTime: Number,
		lastPurchasedDate: Number
	},
	music: {
		avgTime: Number,
		lastPurchasedDate: Number
	},
	travel: {
		avgTime: Number,
		lastPurchasedDate: Number
	},

})

var User = mongoose.model('User', UserSchema);