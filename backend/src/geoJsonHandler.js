
///////////////////////////////////////////////////////////////////////////////////////
// !!! Das ist noch nicht getestet, sondern zunächst alles ins Reine geschrieben !!! //
///////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');


function isCoordinateInBoundingBox(zone, coordinate) {
    return zone.boundingBox.northWest.lat > coordinate.lat &&
        zone.boundingBox.northWest.lon < coordinate.lon &&
        zone.boundingBox.southEast.lat < coordinate.lat &&
        zone.boundingBox.southEast.lon > coordinate.lon;
}

function findRelevantZones(zones, coordinate) {
    let relevantZones = [];
    for (const zone in zones){
        if (this.isCoordinateInBoundingBox(zone[i], coordinate)) {
            relevantZones.push(zone[i]);
        }
    }
    return relevantZones;
}


function loadGeoJsonFile() {
    let rawdata = fs.readFileSync('../../ressource/example.geojson');
    return JSON.parse(rawdata);
}

// parse a geojson file to our zones.json format
function parseGeoJson(geoJson) {
    let zones = [];
    for (let feature in geoJson.features){
        let coordinates = []
        for (let coordinate in feature.coordinates){
            coordinates.push({lon: coordinate[1], lat: coordinate[0]})
        }

        let zone = {
            "name": feature.properties.name,
            "boundingBox": feature.properties.boundingBox,
            "coordinates": coordinates
        };
        zones.push(zone);
    }
    return zones;
}

export {loadGeoJsonFile, isCoordinateInBoundingBox, findRelevantZones};

