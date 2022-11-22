
///////////////////////////////////////////////////////////////////////////////////////
// !!! Das ist noch nicht getestet, sondern zunächst alles ins Reine geschrieben !!! //
///////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');

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



function getGeoJson() {
    return this.geoJson;
}

function isCoordinateInBoundingBox(zone, coordinate) {
    return zone.properties.boundingBox.leftTop.lat > coordinate.lat &&
        zone.properties.boundingBox.leftTop.lon < coordinate.lon &&
        zone.properties.boundingBox.rightBottom.lat < coordinate.lat &&
        zone.properties.boundingBox.rightBottom.lon > coordinate.lon;
}

function findRelevantZones(Point) {
    let relevantZones = [];
    for (let i = 0; i < this.geoJson.length; i++) {
        if (this.isCoordinateInBoundingBox(this.geoJson[i], Point)) {
            relevantZones.push(this.geoJson[i]);
        }
    }
    return relevantZones;
}

export {loadGeoJsonFile, getGeoJson, isCoordinateInBoundingBox, findRelevantZones};

