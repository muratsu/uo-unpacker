var cliloc = require('./lib/cliloc');

cliloc.readData('uo-data/Cliloc.enu', function (err, data) {
    if (err) throw err;
    console.log(data);
});
