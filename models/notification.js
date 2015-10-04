var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var notificationSchema = new Schema({
	
}, { 
	minimize: false
});

var Notification = mongoose.model('Notification', notificationSchema);