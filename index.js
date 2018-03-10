//Importar dependencias
var express = require('express');
var body_parser = require('body-parser');
var request = require('request');

var app = express();
app.use(body_parser.json());

app.listen(8000, function () {
    console.log('El servidor esta en el puerto 8000');
});

app.get('/', function (req, res) {
    res.send('Bienvenido al taller');
});