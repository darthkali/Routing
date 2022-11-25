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

    let oldNorthWestLat = zone[0].lat;
    let oldNorthWestLon = zone[0].lon;
    let oldSouthEastLat = zone[0].lat;
    let oldSouthEastLon = zone[0].lon;

    for (let coordinate of zone) {
        console.log("coordinate: " + coordinate);
        if (coordinate.lat > oldNorthWestLat) {
            oldNorthWestLat = coordinate.lat;
        }
        if (coordinate.lat < oldSouthEastLat) {
            oldSouthEastLat = coordinate.lat;
        }
        if (coordinate.lon < oldNorthWestLon) {
            oldNorthWestLon = coordinate.lon;
        }
        if (coordinate.lon > oldSouthEastLon) {
            oldSouthEastLon = coordinate.lon;
        }
    }

    return {
        northWest: {
            lon: oldNorthWestLon,
            lat: oldNorthWestLat
        },
        southEast: {
            lon: oldSouthEastLon,
            lat: oldSouthEastLat
        }
    };
}


module.exports = {isCoordinateInBoundingBox, findRelevantZones, calculateBoundingBox}
