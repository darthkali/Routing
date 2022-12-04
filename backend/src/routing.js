const rayCast = require('./rayCastingAlgorithm.js')
const geoJson = require('./geoJsonHandler.js')
const polygon_lib = require('./polygon')
const line_lib = require('./line')
const boundingBox_lib = require("./boundingBoxHandler");
const zones_lib = require("./zones");

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
    routeWithSegments.push(line_lib.createLineSegmentWithCoordinates(route.start, route.coordinates[0]))

    for (let i = 0; i < route.coordinates.length; i++) {
        if (i === route.coordinates.length - 1) {
            routeWithSegments.push(line_lib.createLineSegmentWithCoordinates(route.coordinates[i], route.end))
        } else {
            routeWithSegments.push(line_lib.createLineSegmentWithCoordinates(route.coordinates[i], route.coordinates[i + 1]))
        }
    }
    return routeWithSegments
}

function isRouteIntersects(route, relevantZones) {

    if (relevantZones.length !== 0) {
        let routeWithSegments = mapToRouteWithLineSegments(route)
        for (let routeSegment in routeWithSegments) {
            for (let relevantZone in relevantZones) {
                if (polygon_lib.intersectsLineWithPolygon(routeSegment, relevantZone)) {
                    return true
                }
            }
        }
    }
    return false
}


function test() {

    // (lon, lat) => (x, y)

    let line
    let polygon
    let start
    let end

    //intersects
    // line: (0,0) -> (15, 15)
    // polygon: (5,5) -> (10,5) -> (10,10) -> (5,10)
    start = {"lon": 0, "lat": 0}
    end = {"lon": 15, "lat": 15}
    line = line_lib.createLineSegmentWithCoordinates(start, end)

    polygon = [
        {"lon": 5, "lat": 5},
        {"lon": 10, "lat": 5},
        {"lon": 10, "lat": 10},
        {"lon": 5, "lat": 10}
    ]

    console.log(polygon_lib.intersectsLineWithPolygon(line, polygon))

    //does  not intersect
    start = {"lon": 0, "lat": 0}
    end = {"lon": 5, "lat": 15}
    line = line_lib.createLineSegmentWithCoordinates(start, end)

    polygon = [
        {"lon": 5, "lat": 5},
        {"lon": 10, "lat": 5},
        {"lon": 10, "lat": 10},
        {"lon": 5, "lat": 10}
    ]

    console.log(polygon_lib.intersectsLineWithPolygon(line, polygon))

    //touches on one point
    // TODO: should return false
    start = {"lon": 0, "lat": 0}
    end = {"lon": 5, "lat": 10}
    line = line_lib.createLineSegmentWithCoordinates(start, end)

    polygon = [
        {"lon": 5, "lat": 5},
        {"lon": 10, "lat": 5},
        {"lon": 10, "lat": 10},
        {"lon": 5, "lat": 10}
    ]

    console.log(polygon_lib.intersectsLineWithPolygon(line, polygon))

    //touches on one point
    // TODO: should return false
    start = {"lon": 5, "lat": 0}
    end = {"lon": 5, "lat": 10}
    line = line_lib.createLineSegmentWithCoordinates(start, end)

    polygon = [
        {"lon": 5, "lat": 5},
        {"lon": 10, "lat": 5},
        {"lon": 10, "lat": 10},
        {"lon": 5, "lat": 10}
    ]

    console.log(polygon_lib.intersectsLineWithPolygon(line, polygon))
}


// test()


module.exports = {isRouteIntersects}