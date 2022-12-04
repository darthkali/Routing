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
    line = {
        start: { lon: 10.699310302734377, lat: 50.92987248611605 },
        end: { lon: 10.821533203125002, lat: 51.10955772060474 }

    }

    polygon = [
        { lon: 10.784444444444, lat: 51.043333333333 },
        { lon: 10.862777777778, lat: 51.037222222222 },
        { lon: 10.871152173004, lat: 51.042477075215 },
        { lon: 10.88041506558, lat: 51.047114749248 },
        { lon: 10.890301804268, lat: 51.051212691431 },
        { lon: 10.900733092781, lat: 51.05473797008 },
        { lon: 10.911625197907, lat: 51.057662248524 },
        { lon: 10.922890628366, lat: 51.059962016098 },
        { lon: 10.934438846034, lat: 51.061618779959 },
        { lon: 10.946177003502, lat: 51.062619216064 },
        { lon: 10.958010701623, lat: 51.062955278001 },
        { lon: 10.969844760517, lat: 51.062624262739 },
        { lon: 10.981583997357, lat: 51.061628832718 },
        { lon: 10.993134004176, lat: 51.059976994089 },
        { lon: 11.004401918951, lat: 51.057682031299 },
        { lon: 11.015297183276, lat: 51.054762398573 },
        { lon: 11.025732280096, lat: 51.05124156926 },
        { lon: 11.035623445153, lat: 51.047147844316 },
        { lon: 11.044891346114, lat: 51.042514121599 },
        { lon: 11.053461723634, lat: 51.037377627956 },
        { lon: 11.061265989046, lat: 51.031779616386 },
        { lon: 11.068241773766, lat: 51.025765030887 },
        { lon: 11.073055555556, lat: 51.020833333333 },
        { lon: 11.151111111111, lat: 51.014444444444 },
        { lon: 11.131944444444, lat: 50.915277777778 },
        { lon: 10.765833333333, lat: 50.943055555556 },
        { lon: 10.784444444444, lat: 51.043333333333 }


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
    //
    console.log(polygon_lib.intersectsLineWithPolygon(line, polygon))
    //
    // //touches on one point
    // // TODO: should return false
    // start = {"lon": 0, "lat": 0}
    // end = {"lon": 5, "lat": 10}
    // line = line_lib.createLineSegmentWithCoordinates(start, end)
    //
    // polygon = [
    //     {"lon": 5, "lat": 5},
    //     {"lon": 10, "lat": 5},
    //     {"lon": 10, "lat": 10},
    //     {"lon": 5, "lat": 10}
    // ]
    //
    // console.log(polygon_lib.intersectsLineWithPolygon(line, polygon))
    //
    // //touches on one point
    // // TODO: should return false
    // start = {"lon": 5, "lat": 0}
    // end = {"lon": 5, "lat": 10}
    // line = line_lib.createLineSegmentWithCoordinates(start, end)
    //
    // polygon = [
    //     {"lon": 5, "lat": 5},
    //     {"lon": 10, "lat": 5},
    //     {"lon": 10, "lat": 10},
    //     {"lon": 5, "lat": 10}
    // ]
    //
    // console.log(polygon_lib.intersectsLineWithPolygon(line, polygon))
}


test()


module.exports = {isRouteIntersects}