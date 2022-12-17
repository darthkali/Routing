require('dotenv').config();
const axios_lib = require('axios')
const aipHandler_lib = require('./adapter/aipApiAdapter.js')
const boundingBox_lib = require('./gemoetry/boundingBox.js')

function findRelevantZonesForRoute(zones, route) {
    let relevantZones = []

    for (const zone of zones.zones) {
        if (doBoxesOverlap(zone, route)) {
            relevantZones.push(zone)
        }
    }
    return relevantZones
}

function findRelevantZonesWithOffset(zones, route, offset) {
    route.boundingBox.northWest.lat += offset
    route.boundingBox.northWest.lon -= offset
    route.boundingBox.northEast.lat += offset
    route.boundingBox.northEast.lon += offset
    route.boundingBox.southWest.lat -= offset
    route.boundingBox.southWest.lon -= offset
    route.boundingBox.southEast.lat -= offset
    route.boundingBox.southEast.lon += offset
    return findRelevantZonesForRoute(zones, route)
}

//  +-----------------+             +-----------+
//  |                 |             |           |
//  |        +--------+-------------|-+---------|----+
//  |        |        |             | X         |    |
//  |        |        |             | X         |    |
//  |        +--------+-------------+-+---------|----+
//  +-----------------+             +-----------+
function doBoxesOverlap(first, second) {
    let box1_north = first.boundingBox.northWest.lat
    let box1_west = first.boundingBox.northWest.lon
    let box1_south = first.boundingBox.southEast.lat
    let box1_east = first.boundingBox.southEast.lon

    let box2_north = second.boundingBox.northWest.lat
    let box2_west = second.boundingBox.northWest.lon
    let box2_south = second.boundingBox.southEast.lat
    let box2_east = second.boundingBox.southEast.lon

    // WEST = smaller lon, SOUTH = smaller lat
    return !(box1_north < box2_south || box1_west > box2_east || box1_south > box2_north || box1_east < box2_west)
}

function isCoordinateInZone(coordinate, zone) {
    let n = zone.length,
        count = 0,
        x = coordinate.lon,
        y = coordinate.lat,
        x1, x2, y1, y2;

    for (let i = 0; i < n; ++i) {
        if (i === n - 1) {
            x1 = zone[i].lon;
            x2 = zone[0].lon;
            y1 = zone[i].lat;
            y2 = zone[0].lat;
        } else {
            x1 = zone[i].lon;
            x2 = zone[i + 1].lon;
            y1 = zone[i].lat;
            y2 = zone[i + 1].lat;
        }

        if (y < y1 !== y < y2 && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) {
            count += 1
        }
    }
    return count % 2 !== 0;
}
module.exports = {findRelevantZonesForRoute, isCoordinateInZone}
