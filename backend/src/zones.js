require('dotenv').config();
const axios_lib = require('axios')
const aipHandler_lib = require('../src/aipHandler.js')
const boundingBox_lib = require('../src/boundingBoxHandler.js')

function findRelevantZonesForRoute(zones, route) {
    let relevantZones = []

    for (const zone of zones.zones) {
        if (doBoxesOverlap(zone, route)) {
            console.log(zone)
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
async function loadDataFromOpenAip() {
    let apiKey = process.env.API_KEY

    // type 0 = Landesgrenzen
    // type 1 = Militärisches Gebiet
    // type 2 = ???
    // type 3 = ???
    // type 4 = Flughäfen
    // type 5 = ???
    let types = "type=1&type=4"
    let url = `https://api.core.openaip.net/api/airspaces?page=1&limit=1000&fields=name%2C%20geometry&pos=50.950186%2C11.039531&dist=1500000&sortBy=name&sortDesc=true&country=DE&approved=true&searchOptLwc=true&${types}&apiKey=${apiKey}`
    let data
    await axios_lib.get(url, {
        headers: {
            Accept: 'application/json', 'Accept-Encoding': 'application/json'
        },
    }).then((response) => {
        data = response.data

    }).catch((error) => {
        console.log(error)
    })
    //console.log(aipHandler_lib.parseAipGeoJsonToZones(data))
    return aipHandler_lib.parseAipGeoJsonToZones(data)
}


module.exports = {findRelevantZonesForRoute, loadDataFromOpenAip}
