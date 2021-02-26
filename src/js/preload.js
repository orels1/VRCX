console.log('preload');

var fs = require('fs');

window.sex = function() {
    console.log('it works');
    console.log(fs.readdirSync('c:\\'));
};
