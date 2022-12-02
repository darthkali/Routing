const axios = require('axios')
require('dotenv').config();

function isCoordinateInBoundingBox(zone, coordinate) {
    return zone.boundingBox.northWest.lat > coordinate.lat && zone.boundingBox.northWest.lon < coordinate.lon && zone.boundingBox.southEast.lat < coordinate.lat && zone.boundingBox.southEast.lon > coordinate.lon;
}

function findRelevantZonesForRoute(zones, route) {
    let relevantZones = [];
    route.boundingBox = calculateBoundingBox(array___of______route___coordinates)
    for (const zone in zones) {
        if (doBoxesOverlap(zone, route)) {
            relevantZones.push(zone[i]);
        }
    }
    return relevantZones;
}

//  +-----------------+             +-----------+
//  |                 |             |           |
//  |        +--------+-------------|-+---------|----+
//  |        |        |             | X         |    |
//  |        |        |             | X         |    |
//  |        +--------+-------------+-+---------|----+
//  +-----------------+             +-----------+
function doBoxesOverlap(first, second) {
    let box1_north = first.boundingBox.northWest.lon
    let box1_west = first.boundingBox.northWest.lat
    let box1_south = first.boundingBox.southEast.lon
    let box1_east = first.boundingBox.southEast.lat

    let box2_north = second.boundingBox.northWest.lon
    let box2_west = second.boundingBox.northWest.lat
    let box2_south = second.boundingBox.southEast.lon
    let box2_east = second.boundingBox.southEast.lat

    // WEST = smaller lon, SOUTH = smaller lat
    return box1_north < box2_south || box1_west > box2_east || box1_south > box2_north || box1_east < box2_west
}

function calculateBoundingBox(coordinates) {
    let latMax = coordinates[0].lat;
    let latMin = coordinates[0].lat;
    let lonMax = coordinates[0].lon;
    let lonMin = coordinates[0].lon;

    for (let actualCoordinate of coordinates) {
        if (actualCoordinate.lat > latMax) {
            latMax = actualCoordinate.lat;
        } else if (actualCoordinate.lat < latMin) {
            latMin = actualCoordinate.lat;
        }
        if (actualCoordinate.lon > lonMax) {
            lonMax = actualCoordinate.lon;
        } else if (actualCoordinate.lon < lonMin) {
            lonMin = actualCoordinate.lon;
        }
    }

    return {
        northWest: {
            lon: lonMin, lat: latMax
        }, northEast: {
            lon: lonMax, lat: latMax
        }, southWest: {
            lon: lonMin, lat: latMin
        }, southEast: {
            lon: lonMax, lat: latMin
        }
    };
}

async function loadDataFromOpenAip() {
    let apiKey = process.env.API_KEY
    let url = `https://api.core.openaip.net/api/airspaces?page=1&limit=100&fields=name%2Cgeometry&pos=50.950186%2C11.039531&dist=150000&sortBy=name&sortDesc=true&country=DE&approved=true&searchOptLwc=true&apiKey=${apiKey}`

    let data
    await axios.get(url, {
        headers: {
            Accept: 'application/json', 'Accept-Encoding': 'application/json'
        },
    }).then((response) => {
        data = response.data
        console.log(JSON.stringify(data))
    })

    return data
}


module.exports = {isCoordinateInBoundingBox, findRelevantZonesForRoute, calculateBoundingBox, loadDataFromOpenAip}
