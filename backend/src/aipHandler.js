const zones_lib = require('../src/zones.js')
const boundingBox_lib = require('../src/boundingBoxHandler.js')

function parseAipGeoJsonToZones(aipGeoJson) {
    let zones = [];
    for (let item of aipGeoJson.items) {
        let coordinates = []

        for (let coordinate of item.geometry.coordinates[0]) {
            coordinates.push({lon: coordinate[0], lat: coordinate[1]})
        }

        let name = item.name !== undefined ? item.name : "undefined"

        let zone = {
            "name": name,
            "boundingBox": boundingBox_lib.calculateBoundingBox(coordinates),
            "coordinates": coordinates
        };
        zones.push(zone);
    }

    return {"zones": zones};
}


module.exports = {parseAipGeoJsonToZones}

