var express = require('express'); 

var app = express();
var server = app.listen(process.env.PORT || 300);

app.use(express.static('public'));
console.log('server running')

