function isCoordinateInBoundingBox(zone, coordinate) {
    return zone.boundingBox.northWest.lat > coordinate.lat &&
        zone.boundingBox.northWest.lon < coordinate.lon &&
        zone.boundingBox.southEast.lat < coordinate.lat &&
        zone.boundingBox.southEast.lon > coordinate.lon;
}

function findRelevantZones(zones, coordinate) {
    let relevantZones = [];
    for (const zone in zones) {
        if (this.isCoordinateInBoundingBox(zone[i], coordinate)) {
            relevantZones.push(zone[i]);
        }
    }
    return relevantZones;
}

function calculateBoundingBox(zone) {

    let latMax = zone[0].lat;
    let latMin = zone[0].lat;
    let lonMax = zone[0].lon;
    let lonMin = zone[0].lon;


    for (let actualCoordinate of zone) {
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
            lon: lonMin,
            lat: latMax
        },
        northEast: {
            lon: lonMax,
            lat: latMax
        },
        southWest: {
            lon: lonMin,
            lat: latMin
        },
        southEast: {
            lon: lonMax,
            lat: latMin
        }
    };
}


module.exports = {isCoordinateInBoundingBox, findRelevantZones, calculateBoundingBox}
