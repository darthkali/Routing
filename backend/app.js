const express = require('express')
const fs = require("fs");

const rayCast = require('./src/rayCastingAlgorithm.js')
const zones_lib = require('./src/zones.js')
const geoJson = require('./src/geoJsonHandler.js')
const aip = require('./src/aipHandler.js')
const boundingBox_lib = require('./src/boundingBoxHandler.js')


const app = express()
const port = 3000;
const hostname = '127.0.0.1';


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// liefert eine Route anhand des aktuellen Standortes + Ziel zurück
app.get('/getRoute', function (req, res) {


    res.status(200).send(
        {
            "startLat": req.query.startLat,
            "startLon": req.query.startLon,
            "endLat": req.query.endLat,
            "endLon": req.query.endLon,
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


app.get('/getZones', async function (req, res) {

    // let geoJsonFile = geoJson.loadGeoJsonFile('resources/example.geojson')
    // let geoJsonFile = geoJson.loadGeoJsonFile('resources/niedrig.geo.json')
    let zones = await zones_lib.loadDataFromOpenAip()

    // let zones = geoJson.parseGeoJson(geoJsonFile)
    res.status(200).send(zones)
})

app.get('/getRelevantZones', async function (req, res) {
    let route = {}
    //route.coordinates = JSON.parse(req.query.coordinates).coordinates
    //route.boundingBox = boundingBox_lib.calculateBoundingBox(route.coordinates)
    // TODO add start + end attributes

    let zones = await zones_lib.loadDataFromOpenAip()

    //let relevantZones = zones_lib.findRelevantZonesForRoute(allZones, route)
    let relevantZones

    res.status(200).send(relevantZones)
})

app.get('/calculateBoundingBox', function (req, res) {

    let boundingBox = boundingBox_lib.calculateBoundingBox(JSON.parse(req.query.coordinates).coordinates)
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


app.get('/getAipZones', async function (req, res) {
    let data = await zones_lib.loadDataFromOpenAip()
    res.status(200).send(
         data
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

