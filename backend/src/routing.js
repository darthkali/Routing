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

function expandBoundingBox(boundingBox, point) {
    boundingBox.northWest.lon = Math.min(zonesObj.boundingBox.northWest.lon, point.lon)
    boundingBox.northWest.lat = Math.max(zonesObj.boundingBox.northWest.lat, point.lat)
    boundingBox.northEast.lon = Math.max(zonesObj.boundingBox.northEast.lon, point.lon)
    boundingBox.northEast.lat = Math.max(zonesObj.boundingBox.northEast.lat, point.lat)

    boundingBox.southWest.lon = Math.min(zonesObj.boundingBox.southWest.lon, point.lon)
    boundingBox.southWest.lat = Math.min(zonesObj.boundingBox.southWest.lat, point.lat)
    boundingBox.southEast.lon = Math.max(zonesObj.boundingBox.southEast.lon, point.lon)
    boundingBox.southEast.lat = Math.min(zonesObj.boundingBox.southEast.lat, point.lat)
    return boundingBox
}

function findSegmentAlternative(routeSegment, zonesObj) {
    let firstSegment = routeSegment
    let secondSegment = routeSegment
    let offsetFactor = 1
    let offsetPoints = []
    let finnished = false

    // TODO find cap
    while (!finnished && offsetFactor <= 1000) {
        console.log("Suche alternativen Punkt mit Offset-Faktor: " + offsetFactor)
        // Suche einzelne Zone die Probleme macht
        let badZone
        for (let zone of zonesObj.relevantZones) {
            if (doesSegmentIntersect(firstSegment, [zone])) {
                badZone = zone
                break
            }
        }
        // Generiere Segments zu allen Punkten des betreffenden Polygons
        let actualOffset = offsetFactor * OFFSET
        iterateBadZone:
            for (let point of badZone.coordinates) {
                offsetPoints['northWest'] = {'lon': point.lon - actualOffset, 'lat': point.lat + actualOffset}
                offsetPoints['northEast'] = {'lon': point.lon + actualOffset, 'lat': point.lat + actualOffset}
                offsetPoints['southWest'] = {'lon': point.lon - actualOffset, 'lat': point.lat - actualOffset}
                offsetPoints['southEast'] = {'lon': point.lon + actualOffset, 'lat': point.lat - actualOffset}
                offsetPoints['east'] = {'lon': point.lon + actualOffset, 'lat': point.lat}
                offsetPoints['west'] = {'lon': point.lon - actualOffset, 'lat': point.lat}
                offsetPoints['north'] = {'lon': point.lon, 'lat': point.lat + actualOffset}
                offsetPoints['south'] = {'lon': point.lon, 'lat': point.lat - actualOffset}

                for (let pt of offsetPoints) {
                    // konstruiere Segment
                    firstSegment.start = routeSegment.start
                    firstSegment.end = pt
                    // teste intersect
                    if (!doesSegmentIntersect(firstSegment, [badZone])) {
                        // teste zweiter Teil intersect
                        secondSegment.start = pt
                        secondSegment.end = routeSegment.end
                        if (!doesSegmentIntersect(secondSegment, [badZone])) {
                            if (!boundingBox_lib.isCoordinateInBoundingBox(zonesObj, pt)) {
                                zonesObj.boundingBox = expandBoundingBox(zonesObj.boundingBox, pt)
                                zonesObj.relevantZones = zones_lib.findRelevantZonesForRoute(zonesObj.allZones, zonesObj)
                            }
                            if (!doesSegmentIntersect(firstSegment, zonesObj.relevantZones)) {
                                finnished = true
                                break iterateBadZone
                            }
                        }
                    }
                }
            }
        offsetFactor++
    }
    return {'first': firstSegment, 'second': secondSegment}
}

async function doCorrectRoute(route) {
    let zonesObject = {}
    zonesObject.allZones = await aip_lib.loadDataFromOpenAip()
    zonesObject.boundingBox = route.boundingBox
    zonesObject.relevantZones = zones_lib.findRelevantZonesForRoute(zonesObject.allZones, zonesObject)

    let routeWithSegments = mapToRouteWithLineSegments(route) // Array [ Object1 {start: {lon, lat}, end: {lon, lat}},]

    if (zonesObject.relevantZones.length !== 0) {
        while (isRouteWithSegmentsIntersects(routeWithSegments, zonesObject.relevantZones)) {
            //for (let routeSegment of routeWithSegments) {
            for (let i = 0; i < routeWithSegments.length; ++i) {
                routeSegment = routeWithSegments[i]
                if (doesSegmentIntersect(routeSegment, zonesObject.relevantZones)) {
                    // Suche Alternative
                    // findSegmentAlternative kann und wird die relevantZones updaten
                    let newSegments = findSegmentAlternative(routeSegment, zonesObject)

                    // Füge Alternative korrekt ein
                    routeWithSegments.splice(i, 1, newSegments.first, newSegments.second)
                }
            }
        }
    }
    return mapToRouteWithPoints(routeWithSegments)
}


module.exports = {isRouteIntersects, doCorrectRoute}