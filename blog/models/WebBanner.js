/**
 * Created by john on 2017/8/24.
 */
var mongoose = require('mongoose');
var webBannersSchema = require('../schemas/webBanner');

module.exports = mongoose.model('WebBanner',webBannersSchema);
