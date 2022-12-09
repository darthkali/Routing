const polygon_lib = require('./polygon')
const line_lib = require('./line')
const boundingBox_lib = require("./boundingBoxHandler")
const aip_lib = require("./aipHandler")
const zones_lib = require("./zones")

const OFFSET = 0.003

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

function mapToRouteWithPoints(routeWithLineSegments) {
    let routeWithPoints = {}
    routeWithPoints['coordinates'] = []

    routeWithPoints.coordinates.push(routeWithLineSegments[0]['start'])
    for (let i = 0; i < routeWithLineSegments.length - 1; i++) {
        routeWithPoints.coordinates.push(routeWithLineSegments[i]['end'])
    }
    return routeWithPoints
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

function isRouteWithSegmentsIntersects(routeWithSegments, relevantZones) {
    if (relevantZones.length !== 0) {
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

function doesSegmentIntersect(routeSegment, relevantZones) {
    for (let relevantZone of relevantZones) {
        if (polygon_lib.intersectsLineWithPolygon(routeSegment, relevantZone.coordinates)) {
            return true
        }
    }
    return false
}

function findSegmentAlternative(routeSegment, zonesObj) {
    let firstSegment = routeSegment
    let secondSegment = routeSegment
    let offsetFactor = 0
    let offsetPoints = []
    let finnished = false

    while(!finnished) {
        // Suche einzelne Zone die Probleme macht
        let badZone
        for (let zone of zonesObj.relevantZones) {
            if(doesSegmentIntersect(firstSegment, zone)) {
                badZone = zone
                break
            }
        }
        // Suche Umweg
        let newPoint
        // Punkt in irgendeiner Zone prüfen


        // Prüfe neuer Punkt in Routen-BoundingBox
        if(!boundingBox_lib.isCoordinateInBoundingBox(zonesObj, newPoint)) {
            // BB vergrößern
            zonesObj.boundingBox.northWest.lon = Math.min(zonesObj.boundingBox.northWest.lon, newPoint.lon)
            zonesObj.boundingBox.northWest.lat = Math.max(zonesObj.boundingBox.northWest.lat, newPoint.lat)
            zonesObj.boundingBox.northEast.lon = Math.max(zonesObj.boundingBox.northEast.lon, newPoint.lon)
            zonesObj.boundingBox.northEast.lat = Math.max(zonesObj.boundingBox.northEast.lat, newPoint.lat)

            zonesObj.boundingBox.southWest.lon = Math.min(zonesObj.boundingBox.southWest.lon, newPoint.lon)
            zonesObj.boundingBox.southWest.lat = Math.min(zonesObj.boundingBox.southWest.lat, newPoint.lat)
            zonesObj.boundingBox.southEast.lon = Math.max(zonesObj.boundingBox.southEast.lon, newPoint.lon)
            zonesObj.boundingBox.southEast.lat = Math.min(zonesObj.boundingBox.southEast.lat, newPoint.lat)

            zonesObj.relevantZones = zones_lib.findRelevantZonesForRoute(zonesObj.allZones, zonesObj)
        }
    }

    return {firstSegment, secondSegment}
}

async function doCorrectRoute(route, relevantZones) {
    if (relevantZones.length !== 0) {
        let zonesObject = {}
        zonesObject.allZones = await aip_lib.loadDataFromOpenAip()
        zonesObject.relevantZones = relevantZones
        zonesObject.boundingBox = route.boundingBox

        let routeWithSegments = mapToRouteWithLineSegments(route) // Array [ Object1 {start: {lon, lat}, end: {lon, lat}},]
        while (isRouteWithSegmentsIntersects(routeWithSegments, zonesObject.relevantZones)) {
            for (let routeSegment of routeWithSegments) {
                if (doesSegmentIntersect(routeSegment, zonesObject.relevantZones)) {
                    // Suche Alternative
                    // findSegmentAlternative kann und wird die relevantZones updaten
                    let newSegments = findSegmentAlternative(routeSegment, zonesObject)

                    // Prüfe Bounding Box
                    let newPoint = newSegments[0]['end']
                    let routeWithPoints = mapToRouteWithPoints(routeWithSegments)
                    routeWithPoints['boundingBox'] = boundingBox_lib.calculateBoundingBox(routeWithPoints['coordinates'])
                    if (!boundingBox_lib.isCoordinateInBoundingBox(routeWithPoints, newPoint)) {

                    }

                    // Füge Alternative korrekt ein
                }
            }
        }
    }
    return route
}


module.exports = {isRouteIntersects}