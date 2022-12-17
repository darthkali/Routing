const express = require('express')


const zones_lib = require('./src/zones.js')
const routing_lib = require('./src/routing')
const aip_lib = require('./src/adapter/aipApiAdapter.js')
const boundingBox_lib = require('./src/gemoetry/boundingBox.js')
const openElevation_lib = require('./src/adapter/elevationAdapter')


const app = express()
const port = 3000;
const hostname = '127.0.0.1';


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


// Routes ----------------------------------------------------------------------

// liefert eine Route anhand des aktuellen Standortes + Ziel zurück
app.get('/getRoute', async function (req, res) {
    let route = {}
    route.coordinates = JSON.parse(req.query.coordinates).coordinates
    route.boundingBox = boundingBox_lib.calculateBoundingBox(route.coordinates)

    // Sichere Route berechnen
    let correctRoute = await routing_lib.doCorrectRoute(route)

    // Höhendaten ergänzen
    await openElevation_lib.elevateRoute(correctRoute)
    console.log('Elevated Route')
    console.log(correctRoute)

    res.status(200).send(correctRoute)
})

app.get('/calculateBoundingBox', function (req, res) {

    let boundingBox = boundingBox_lib.calculateBoundingBox(JSON.parse(req.query.coordinates).coordinates)
    res.status(200).send(
        boundingBox
    )
})

app.get('/getRelevantZones', async function (req, res) {
    let route = {}
    route.coordinates = JSON.parse(req.query.coordinates).coordinates
    route.boundingBox = boundingBox_lib.calculateBoundingBox(route.coordinates)

    let zones = await aip_lib.loadDataFromOpenAip()

    let relevantZones = zones_lib.findRelevantZonesForRoute(zones, route)

    res.status(200).send(relevantZones)
})


app.get('/isRouteIntersects', async function (req, res) {
    let route = {}
    route.coordinates = JSON.parse(req.query.coordinates).coordinates
    route.boundingBox = boundingBox_lib.calculateBoundingBox(route.coordinates)

    let zones = await aip_lib.loadDataFromOpenAip()
    let relevantZones = zones_lib.findRelevantZonesForRoute(zones, route)

    let result = routing_lib.isRouteIntersects(route, relevantZones)
    console.log(result)
    res.status(200).send(
        {"result": result}
    )

})


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

