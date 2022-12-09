function calculateBoundingBox(coordinates) {
    let latMax = coordinates[0].lat;
    let latMin = coordinates[0].lat;
    let lonMax = coordinates[0].lon;
    let lonMin = coordinates[0].lon;

    for (let actualCoordinate of coordinates) {
        if (actualCoordinate.lat > latMax) {
            latMax = actualCoordinate.lat;
        } else if (actualCoordinate.lat < latMin) {
            latMin = actualCoordinate.lat;
        }
        if (actualCoordinate.lon > lonMax) {
            lonMax = actualCoordinate.lon;
        } else if (actualCoordinate.lon < lonMin) {
            lonMin = actualCoordinate.lon;
        }
    }

    return {
        northWest: {
            lon: lonMin, lat: latMax
        }, northEast: {
            lon: lonMax, lat: latMax
        }, southWest: {
            lon: lonMin, lat: latMin
        }, southEast: {
            lon: lonMax, lat: latMin
        }
    };
}

function isCoordinateInBoundingBox(zone, coordinate) {
    return zone.boundingBox.northWest.lat > coordinate.lat && zone.boundingBox.northWest.lon < coordinate.lon && zone.boundingBox.southEast.lat < coordinate.lat && zone.boundingBox.southEast.lon > coordinate.lon;
}

function isCoordinateInOneOfBoundingBoxes(zones, coordinate) {
    for (let zone of zones) {
        if (isCoordinateInBoundingBox(zone, coordinate)) {
            return true
        }
    }
    return false
}

module.exports = {calculateBoundingBox, isCoordinateInBoundingBox, isCoordinateInOneOfBoundingBoxes}