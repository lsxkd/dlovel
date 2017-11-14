/**
 * Created by john on 2017/8/21.
 */

var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);
