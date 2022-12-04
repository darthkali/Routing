const polygon_lib = require('./polygon')
const line_lib = require('./line')

// mögliches gute offset: 0.003 lat / lon

//input 2 Koordinaten
//coordinateStart = [lat, lon]
//coordinateEnd = [lat, lon]
//durchlaufe alle in einem abstand von X punkte auf der linie zwischen start und end
//durchlaufe alle relevanten sperrzonen und schaue ob der punkt in der sperrzone liegt
//wenn ja, dann berechne eine neue route


//FH lon 11.039945, 50.984062
//Bhf lon 11.038489, 50.970533
// sqrt((fhlon-bhflon)^2 + (fhlat-bhflat)^2) = 1.4km
// länge zwischen den punkten 0,0136071

// schrittweite = 0,0001
function calculateAngle(coordinateStart, coordinateEnd) {
    return Math.atan2(coordinateEnd.lat - coordinateStart.lat, coordinateEnd.lon - coordinateStart.lon);
}

function calculateNextCoordinate(coordinate, angle, stepSize) {
    return {
        lat: coordinate.lat + stepSize * Math.sin(angle),
        lon: coordinate.lon + stepSize * Math.cos(angle)
    };
}

function mapToRouteWithLineSegments(route) {
    let routeWithSegments = []

    for (let i = 0; i < route.coordinates.length - 1; i++) {
        routeWithSegments.push(line_lib.createLineSegmentWithCoordinates(route.coordinates[i], route.coordinates[i + 1]))
    }
    return routeWithSegments
}

function isRouteIntersects(route, relevantZones) {
    if (relevantZones.length !== 0) {

        let routeWithSegments = mapToRouteWithLineSegments(route)
        for (let routeSegment of routeWithSegments) {
            for (let relevantZone of relevantZones) {
                if (polygon_lib.intersectsLineWithPolygon(routeSegment, relevantZone.coordinates)) {
                    return true
                }
            }
        }
    }
    return false
}


module.exports = {isRouteIntersects}