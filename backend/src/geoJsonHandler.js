
///////////////////////////////////////////////////////////////////////////////////////
// !!! Das ist noch nicht getestet, sondern zunächst alles ins Reine geschrieben !!! //
///////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');
const Zones = require('../src/zones.js')

function loadGeoJsonFile(path = '../../ressource/example.geojson') {
    let rawdata = fs.readFileSync(path);
    return JSON.parse(rawdata);
}

// parse a geojson file to our zones.json format
function parseGeoJson(geoJson) {
    let zones = [];
    for (let feature of geoJson.features){
        let coordinates = []

        for (let coordinate of feature.geometry.coordinates[0][0]){
            coordinates.push({lon: coordinate[0], lat: coordinate[1]})
        }

        let zone = {
            "name": feature.properties.name,
            "boundingBox": Zones.calculateBoundingBox(coordinates),
            "coordinates": coordinates
        };
        zones.push(zone);
    }

    return {"zones" : zones};
}


module.exports = {loadGeoJsonFile, parseGeoJson}

