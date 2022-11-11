// { "type": "Polygon",
//     "coordinates": [
//     [[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]
// ]
// }


class GeoJsonHandler {
    constructor() {
        this.geoJson = null;
    }

    loadGeoJsonFile(gpxFile) {
        //TODO: load GeoJson File
    }

    isZoneRelevant(Polygon, Point) {
        return Polygon.Propertie.BoundingBox.leftTop.lat > Point.lat &&
            Polygon.Propertie.BoundingBox.leftTop.lon < Point.lon &&
            Polygon.Propertie.BoundingBox.leftTop.lat < Point.lat &&
            Polygon.Propertie.BoundingBox.leftTop.lon > Point.lon;
    }
}

