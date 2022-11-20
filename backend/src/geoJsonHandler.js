
///////////////////////////////////////////////////////////////////////////////////////
// !!! Das ist noch nicht getestet, sondern zunächst alles ins Reine geschrieben !!! //
///////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');

function loadGeoJsonFile() {

    let rawdata = fs.readFileSync('../../ressource/example.geojson');
    let student = JSON.parse(rawdata);
    console.log(student);
    return student
    //
    //
    //
    // // return await fetch('./example.geojson');
    // let response2 = null
    // let json2 = null
    //  fetch("../../ressource/example.geojson")
    //     .then(response => {
    //         response.json()
    //         response2 = response
    //         console.log("response2")
    //         console.log(response2)
    //     })
    //     .then(json => {
    //             console.log(json)
    //             json2 = json;
    //             console.log("json2")
    //             console.log(json2)
    //         }
    //     )
    // return response2
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

