const path = require('path');
const { app, nativeImage } = require('electron');

var APP_NAME = 'VRCX';
var APP_ICON_PATH = path.join(app.getAppPath(), 'assets/icon.ico');
var APP_ICON = nativeImage.createFromPath(APP_ICON_PATH);

module.exports = {
    APP_NAME,
    APP_ICON
};
