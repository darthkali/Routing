require('dotenv').config();
const axios_lib = require('axios')
const aipHandler_lib = require('../src/aipHandler.js')
const boundingBox_lib = require('../src/boundingBoxHandler.js')

function findRelevantZonesForRoute(zones, route) {
    let relevantZones = [];
    for (const zone in zones) {
        if (boundingBox_lib.isCoordinateInBoundingBox(zone[i], coordinate)) {
            relevantZones.push(zone[i]);
        }
    }
    return relevantZones;
}

async function loadDataFromOpenAip() {
    let apiKey = process.env.API_KEY
    let url = `https://api.core.openaip.net/api/airspaces?page=1&limit=100&fields=name%2Cgeometry&pos=50.950186%2C11.039531&dist=150000&sortBy=name&sortDesc=true&country=DE&approved=true&searchOptLwc=true&apiKey=${apiKey}`

    let data
    await axios_lib.get(url, {
        headers: {
            Accept: 'application/json', 'Accept-Encoding': 'application/json'
        },
    }).then((response) => {
        data = response.data

    })
    console.log(aipHandler_lib.parseAipGeoJsonToZones(data))
    return aipHandler_lib.parseAipGeoJsonToZones(data)
}


module.exports = {findRelevantZonesForRoute, loadDataFromOpenAip}
