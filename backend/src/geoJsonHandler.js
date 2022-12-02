///////////////////////////////////////////////////////////////////////////////////////
// !!! Das ist noch nicht getestet, sondern zunächst alles ins Reine geschrieben !!! //
///////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');
const boundingBox_lib = require('../src/boundingBoxHandler.js')


function loadGeoJsonFile(path = '../../ressource/example.geojson') {
    let rawdata = fs.readFileSync(path);
    return JSON.parse(rawdata);
}

// parse a geojson file to our zones.json format
function parseGeoJson(geoJson) {
    let zones = [];
    for (let feature of geoJson.features) {
        let coordinates = []


        if(feature.geometry.coordinates[0][0][0].length > 1) {
            for (let coordinate of feature.geometry.coordinates[0][0]) {
                coordinates.push({lon: coordinate[0], lat: coordinate[1]})
            }
        } else {
            for (let coordinate of feature.geometry.coordinates[0]) {
                coordinates.push({lon: coordinate[0], lat: coordinate[1]})
            }
        }

        let name
        if (feature.name !== undefined) {
            name = feature.name
        } else if (feature.properties.name !== undefined) {
            name = feature.properties.name
        } else {
            name = "undefined"
        }


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

