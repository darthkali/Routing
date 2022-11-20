const express = require('express')
const fs = require("fs");

const rayCast = require('./src/rayCastingAlgorithm.js')

const app = express()
const port = 3000;
const hostname = '127.0.0.1';

// liefert eine Route anhand des aktuellen Standortes zurück
app.get('/getRoute/:lat/:lon', function (req, res) {
    let result = {"lat": req.params.lat, "lon": req.params.lon}
    console.log(result)
    res.status(200).send({"result": result})
})


app.get('/getZones', function (req, res) {
    fs.readFile(__dirname + "/resources/zones.json", 'utf8', function (err, data) {
        console.log(data);
        res.status(200).end(data)
    });
})

app.get('/getRoutes', function (req, res) {
    fs.readFile(__dirname + "/resources/route.json", 'utf8', function (err, data) {
        console.log(data);
        res.status(200).end(data)
    });
})


app.get('/calcRayCasting', function (req, res) {
    const polygon = [[223, 431], [50, 176], [136, 50], [400, 50], [500, 176], [500, 400], [400, 500], [200, 500]];
    const point = [300, 176];
    let result = rayCast(point, polygon)
    console.log(result)

    res.status(200).send({"result": result})
})

var server = app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

