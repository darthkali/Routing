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
//         "lat": 400,
//         "lon": 50
//       },
//       "rightBottom": {
//         "lat": 50,
//         "lon": 500
//       }
//     }
//   }
// }

///////////////////////////////////////////////////////////////////////////////////////
// !!! Das ist noch nicht getestet, sondern zunächst alles ins Reine geschrieben !!! //
///////////////////////////////////////////////////////////////////////////////////////

class GeoJsonHandler {
    constructor() {
        this.geoJson = null;
    }

    loadGeoJsonFile(gpxFile) {
        //TODO: load GeoJson File
    }

    isCoordinateInBoundingBox(zone, coordinate) {
        return zone.properties.boundingBox.leftTop.lat > coordinate.lat &&
            zone.properties.boundingBox.leftTop.lon < coordinate.lon &&
            zone.properties.boundingBox.rightBottom.lat < coordinate.lat &&
            zone.properties.boundingBox.rightBottom.lon > coordinate.lon;
    }


    findRelevantZones(Point) {
        let relevantZones = [];
        for (let i = 0; i < this.geoJson.length; i++) {
            if (this.isCoordinateInBoundingBox(this.geoJson[i], Point)) {
                relevantZones.push(this.geoJson[i]);
            }
        }
        return relevantZones;
    }
}

