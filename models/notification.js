var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var NotificationSchema = new Schema({
	message: String,
	time: Date
});

var Notification = mongoose.model('Notification', NotificationSchema);