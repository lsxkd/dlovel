/**
 * Created by john on 2017/8/24.
 */
var mongoose = require('mongoose');
var webSettingsSchema = require('../schemas/webSetting');

module.exports = mongoose.model('WebSetting',webSettingsSchema);
