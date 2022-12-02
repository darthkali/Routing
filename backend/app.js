const express = require('express')
const fs = require("fs");

const rayCast = require('./src/rayCastingAlgorithm.js')
const zones = require('./src/zones.js')
const geoJson = require('./src/geoJsonHandler.js')

const app = express()
const port = 3000;
const hostname = '127.0.0.1';


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
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

    // let geoJsonFile = geoJson.loadGeoJsonFile('resources/example.geojson')
    let geoJsonFile = geoJson.loadGeoJsonFile('resources/niedrig.geo.json')

    let zones = geoJson.parseGeoJson(geoJsonFile)
    res.status(200).send(zones)
})

app.get('/calculateBoundingBox', function (req, res) {

    let boundingBox = zones.calculateBoundingBox(JSON.parse(req.query.coordinates).coordinates)
    console.log(boundingBox)
    res.status(200).send(
        boundingBox
    )
})


app.get('/getRoutes', function (req, res) {
    fs.readFile(__dirname + "/resources/route.json", 'utf8', function (err, data) {
        console.log(data);
        res.status(200).end(data)
    });
})


app.get('/apitest', async function (req, res) {

    let data = await zones.loadDataFromOpenAip()
    res.status(200).send(
        {
            "data": data,
        }
    )
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


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

