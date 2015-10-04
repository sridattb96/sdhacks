var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	mostExpName: String,
	mostExpPrice: Number
})

var User = mongoose.model('User', UserSchema);