var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
	
}, { 
	minimize: false
});

var User = mongoose.model('User', UserSchema);