// { "type": "Polygon",
//     "coordinates": [
//     [[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]
// ]
// }


// Ein Polygon
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// {
//   "type": "Feature",
//   "geometry": {
//     "type": "Polygon",
//     "coordinates": [
//       [
//         [400, 431], [50, 176], [136, 50], [150, 300], [400, 50], [300, 500], [500, 176], [300, 400], [400, 480],
//         [200, 500], [100, 450]
//       ]
//     ]
//   },
//   "properties": {
//     "name": "PolyTest1",
//     "boundingBox": {
//       "leftTop": {
//         "lon": 50
//         "lat": 400,
//       },
//       "rightBottom": {
//         "lon": 500
//         "lat": 50,
//       }
//     }
//   }
// }

///////////////////////////////////////////////////////////////////////////////////////
// !!! Das ist noch nicht getestet, sondern zunächst alles ins Reine geschrieben !!! //
///////////////////////////////////////////////////////////////////////////////////////

// class GeoJsonParser {
//     constructor() {
//         this.geoJson = null;
//     }

async function loadGeoJsonFile() {
    // return await fetch('./example.geojson');
    let response2 = null
    let json2 = null
     fetch("example.geojson")
        .then(response => {
            response.json()
            response2 = response
            console.log("response2")
            console.log(response2)
        })
        .then(json => {
                console.log(json)
                json2 = json;
                console.log("json2")
                console.log(json2)
            }
        )
    return response2
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

