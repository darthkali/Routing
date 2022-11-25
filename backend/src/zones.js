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


module.exports = {isCoordinateInBoundingBox, findRelevantZones}
