const express = require('express')
const fs = require("fs");

const rayCast = require('./src/rayCastingAlgorithm.js')
const zones = require('./src/zones.js')
const geoJson = require('./src/geoJsonHandler.js')

const app = express()
const port = 3000;
const hostname = '127.0.0.1';

var cors = require('cors');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    cors({origin: 'http://127.0.0.1:63342'})
    // Pass to next layer of middleware
    next();
});

// liefert eine Route anhand des aktuellen Standortes zurück
app.get('/getRoute', function (req, res) {
    res.status(200).send(
        {
            "lat": req.query.lat,
            "lon": req.query.lon
        }
    )
})

// liefert eine Route anhand des aktuellen Standortes zurück
app.get('/getRouteTest', function (req, res) {
    // res.status(200).send(
    //     {
    //         "latStart": req.query.latStart,
    //         "lonStart": req.query.lonStart,
    //         "latEnd": req.query.latEnd,
    //         "lonEnd": req.query.lonEnd
    //     }
    // )

    res.status(200).send(
        {
            "result": true,
        }
    )
})




app.get('/getZones', function (req, res) {

    let geoJsonFile = geoJson.loadGeoJsonFile('resources/example.geojson')
    let zones = geoJson.parseGeoJson(geoJsonFile)
    res.status(200).send(zones)
})

app.get('/getRoutes', function (req, res) {
    fs.readFile(__dirname + "/resources/route.json", 'utf8', function (err, data) {
        console.log(data);
        res.status(200).end(data)
    });
})


// app.get('/calcRayCasting', function (req, res) {
//     const polygon = [[223, 431], [50, 176], [136, 50], [400, 50], [500, 176], [500, 400], [400, 500], [200, 500]];
//     const point = [300, 176];
//     let result = rayCast(point, polygon)
//     console.log(result)
//
//     res.status(200).send({"result": result})
// })

app.get('/calcRayCasting', function (req, res) {


    const polygon = [[223, 431], [50, 176], [136, 50], [400, 50], [500, 176], [500, 400], [400, 500], [200, 500]];
    const point = [300, 176];
    let result = rayCast(point, polygon)
    console.log(result)

    res.status(200).send(
        {
            "result": result,
            "test": req.query.test,
            "test2": req.query.test2
        }
    )
})


var server = app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

