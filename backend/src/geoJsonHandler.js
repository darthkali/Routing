const fs = require('fs');
const boundingBox_lib = require('../src/boundingBoxHandler.js')


function loadGeoJsonFile(path = '../../ressource/example.geojson') {
    let data = fs.readFileSync(path);
    return JSON.parse(data);
}

// parse a geojson file to our zones.json format
function parseGeoJson(geoJson) {
    let zones = [];
    for (let feature of geoJson.features) {
        let coordinates = []

        for (let coordinate of feature.geometry.coordinates[0][0]) {
            coordinates.push({lon: coordinate[0], lat: coordinate[1]})
        }

        let name = feature.properties.name !== undefined ? feature.properties.name : "undefined"

        let zone = {
            "name": name,
            "boundingBox": boundingBox_lib.calculateBoundingBox(coordinates),
            "coordinates": coordinates
        };
        zones.push(zone);
    }

    return {"zones": zones};
}


module.exports = {loadGeoJsonFile, parseGeoJson}

