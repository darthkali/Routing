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
    res.send(200, result);
})

app.get('/user/:userId/books/:bookId', (req, res) => {
    req.params; // { userId: '42', bookId: '101' }
    res.json(req.params);
});

app.get('/getZones', function (req, res) {
    fs.readFile(__dirname + "/resources/zones.json", 'utf8', function (err, data) {
        console.log(data);
        res.end(data);
    });
})

app.get('/getRoutes', function (req, res) {
    fs.readFile(__dirname + "/resources/route.json", 'utf8', function (err, data) {
        console.log(data);
        res.end(data);
    });
})


app.get('/calcRayCasting', function (req, res) {
    const polygon = [[400, 431], [50, 176], [136, 50], [150, 300], [400, 50], [300, 500], [500, 176], [300, 400], [400, 480], [200, 500], [100, 450]];
    const point = [100, 100];
    let result = rayCast(point, polygon)
    console.log(result)

    res.send(200, {"result": result})
})

var server = app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

