require('dotenv').config();
const axios_lib = require('axios')
const aipHandler_lib = require('../src/aipHandler.js')
const boundingBox_lib = require('../src/boundingBoxHandler.js')

function findRelevantZonesForRoute(zones, route) {
    let relevantZones = []

    for (const zone of zones.zones) {
        if (doBoxesOverlap(zone, route)) {
            relevantZones.push(zone)
        }
    }
    return relevantZones
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

//TODO move to aipHandler



module.exports = {findRelevantZonesForRoute}
