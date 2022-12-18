const polygon_lib = require('./gemoetry/polygon')
const line_lib = require('./gemoetry/line')
const boundingBox_lib = require("./gemoetry/boundingBox")
const aip_lib = require("./adapter/aipApiAdapter")
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
    for (let i = 0; i < routeWithLineSegments.length; i++) {
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
    boundingBox.northWest.lon = Math.min(boundingBox.northWest.lon, point.lon)
    boundingBox.northWest.lat = Math.max(boundingBox.northWest.lat, point.lat)
    boundingBox.northEast.lon = Math.max(boundingBox.northEast.lon, point.lon)
    boundingBox.northEast.lat = Math.max(boundingBox.northEast.lat, point.lat)

    boundingBox.southWest.lon = Math.min(boundingBox.southWest.lon, point.lon)
    boundingBox.southWest.lat = Math.min(boundingBox.southWest.lat, point.lat)
    boundingBox.southEast.lon = Math.max(boundingBox.southEast.lon, point.lon)
    boundingBox.southEast.lat = Math.min(boundingBox.southEast.lat, point.lat)
    return boundingBox
}

function findSegmentAlternative(routeSegment, zonesObj) {
    let firstSegment = {...routeSegment}
    let secondSegment = {...routeSegment}
    let offsetFactor = 1
    let offsetPoints = []
    let finnished = false

    // Suche einzelne Zone die Probleme macht
    let badZone
    for (let zone of zonesObj.relevantZones) {
        //if (doesSegmentIntersect(firstSegment, [zone])) {
        if (doesSegmentIntersect(routeSegment, [zone])) {
            badZone = zone
            break
        }
    }

    // TODO find cap
    while (!finnished && offsetFactor <= 100000) {
        //console.log("Suche alternativen Punkt mit Offset-Faktor: " + offsetFactor)
        if (badZone === undefined) {
            console.log(badZone)
            break
        }

        if (offsetFactor > 300) {
            return {'zone': badZone}
        }

        // Generiere Segments zu allen Punkten des betreffenden Polygons
        let actualOffset = offsetFactor * OFFSET

        iterateBadZone:
            for (let point of badZone.coordinates) {
                offsetPoints[0] = {'lon': point.lon - actualOffset, 'lat': point.lat + actualOffset}
                offsetPoints[1] = {'lon': point.lon + actualOffset, 'lat': point.lat + actualOffset}
                offsetPoints[2] = {'lon': point.lon - actualOffset, 'lat': point.lat - actualOffset}
                offsetPoints[3] = {'lon': point.lon + actualOffset, 'lat': point.lat - actualOffset}
                offsetPoints[4] = {'lon': point.lon + actualOffset, 'lat': point.lat}
                offsetPoints[5] = {'lon': point.lon - actualOffset, 'lat': point.lat}
                offsetPoints[6] = {'lon': point.lon, 'lat': point.lat + actualOffset}
                offsetPoints[7] = {'lon': point.lon, 'lat': point.lat - actualOffset}

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

    let whilecount = 0
    if (zonesObject.relevantZones.length !== 0) {
        while (isRouteWithSegmentsIntersects(routeWithSegments, zonesObject.relevantZones)) {
            console.log(++whilecount)

            //for (let routeSegment of routeWithSegments) {
            for (let i = 0; i < routeWithSegments.length; ++i) {
                let routeSegment = routeWithSegments[i]
                if (doesSegmentIntersect(routeSegment, zonesObject.relevantZones)) {
                    // Suche Alternative
                    // findSegmentAlternative kann und wird die relevantZones updaten
                    let newSegments = findSegmentAlternative(routeSegment, zonesObject)

                    if (newSegments.first === undefined || newSegments.second === undefined) {
                        // TODO: bei konkaven Zonen kann es passieren, dass kein Weg über EINEN zusätzlich zu berechnenden Punkt realisierbar ist \
                        // der Algorithmus läuft dann endlos weiter \
                        // Es bedarf also zwingend noch eines weiteren Punktes. \
                        // Unser Ansatz ist, zuerst einen Weg in eine Ecke der BoundingBox der betreffenden Zone zu finden, \
                        // und von dort aus erneut nach einem Weg zum eigentlichen "nächsten Zielpunkt" zu suchen. \
                        // Leider kann auch das durch verrückte Formen oder weitere Zonen in der Nähe verhindert werden - man müsste rekursiv vorgehen.

                        // Um die Suche zu vereinfachen haben wir außerdem die Idee gehabt, unter den 'relevantZones' überlappende Zonen zu vereinigen. \
                        // Dies erhöht die Übersicht und vermeidet auch bei allen "Finde-die-erste-passende-Zone"-Algorithmen, dass eine wenig nützliche Wahl getroffen wird.

                        // for (let vertex in newSegments.zone.boundingBox) {
                        //     let vertexSegment = {}
                        //     vertexSegment.start = {...routeSegment.start}
                        //     vertexSegment.end = {...vertex}
                        //
                        //     newSegments = findSegmentAlternative(vertexSegment, zonesObject)
                        //     if (newSegments.first !== undefined) {
                        //         routeWithSegments.splice(i, 1, newSegments.first, newSegments.second)
                        //
                        //         let secondVertexSegment = {}
                        //         secondVertexSegment.start = {...newSegments.second.end}
                        //         secondVertexSegment.end = {...routeSegment.end}
                        //
                        //         newSegments = findSegmentAlternative(secondVertexSegment, zonesObject)
                        //         if (newSegments.first !== undefined) {
                        //             routeWithSegments.splice(i + 1, 0, newSegments.first, newSegments.second)
                        //         } else {
                        //             console.log("Tut mir leid, da mach ich nicht weiter.")
                        //         }
                        //     }
                        // }
                    } else {
                        // Lösche das Element i und ersetze durch die beiden neuen
                        routeWithSegments.splice(i, 1, newSegments.first, newSegments.second)
                    }
                }
            }
        }
    }
    let routeWithPoints = mapToRouteWithPoints(routeWithSegments)
    return routeWithPoints
}


module.exports = {isRouteIntersects, doCorrectRoute}
