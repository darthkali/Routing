const line_lib = require('./line')

function intersectsLineWithPolygon(lineSegment, polygon) {


    // Polygon input
    // "coordinates": [
    //     {
    //         "lon": "11.0621381",
    //         "lat": "50.9464637"
    //     },
    //     {
    //         "lon": "11.0621381",
    //         "lat": "50.9464637"
    //     }
    // ]

    // polygon
    // 0 ---- 1 ---- 2 ---- 3 ---- 4
    // line1 = 01
    // line2 = 12
    // line3 = 23
    // line4 = 34
    // line5 = 40
    // polygon = [
    //     {
    //         start: {
    //             lon: 0.00,
    //             lat: 0.00
    //         },
    //         end: {
    //             lon: 0.00,
    //             lat: 0.00
    //         }
    //     },
    //     {
    //         start: {
    //             lon: 0.00,
    //             lat: 0.00
    //         },
    //         end: {
    //             lon: 0.00,
    //             lat: 0.00
    //         }
    //     }
    // ]

    // lineSegment
    // {
    //     start: {
    //         lon: 0.00,
    //         lat: 0.00
    //     },
    //     end: {
    //         lon: 0.00,
    //         lat: 0.00
    //     }
    // }
    // 0 ---- 1

    if(polygon === undefined){
        console.log("function:intersectsLineWithPolygon::\nThe given polygon was not defines or is invalid!")
        console.log("Polygon:")
        console.log(polygon)
        return null
    }

    let polygonWithLineSegments = mapToPolygonWithLineSegments(polygon)
    for (const polygonSegment of polygonWithLineSegments) {
        if (line_lib.doIntersect(lineSegment.start, lineSegment.end, polygonSegment.start, polygonSegment.end)) {
            return true
        }
    }
    return false
}


function mapToPolygonWithLineSegments(polygon) {

    // Polygon input
    // [
    //     {
    //         "lon": "10.0",
    //         "lat": "50.0"
    //     },
    //     {
    //         "lon": "11.0",
    //         "lat": "51.0"
    //     },
    //     {
    //         "lon": "12.0",
    //         "lat": "52.0"
    //     }
    // ]

    // Polygon output
    //  [
    //     {
    //         "start": {
    //             "lon": "10.0",
    //             "lat": "50.0"
    //         },
    //         "end": {
    //             "lon": "11.0",
    //             "lat": "51.0"
    //         }
    //     },
    //     {
    //         "start": {
    //             "lon": "11.0",
    //             "lat": "51.0"
    //         },
    //         "end": {
    //             "lon": "12.0",
    //             "lat": "52.0"
    //         }
    //     },
    // ]

    if(polygon === undefined){
        console.log("function:mapToPolygonWithLineSegments::\nThe given polygon was not defines or is invalid!")
        console.log("Polygon:")
        console.log(polygon)
        return null
    }

    if (polygon[0].start !== undefined) {
        return null
    }

    let polygonWithLineSegments = []
    for (let i = 0; i < polygon.length; i++) {
        let start
        let end
        start = {lon: polygon[i].lon, lat: polygon[i].lat}
        if (i === polygon.length - 1) {
            end = {"lon": polygon[0].lon, "lat": polygon[0].lat}
        } else {
            end = {"lon": polygon[i + 1].lon, "lat": polygon[i + 1].lat}
        }

        polygonWithLineSegments.push({
            "start": start,
            "end": end
        })
    }
    return polygonWithLineSegments
}

function mapToPolygonWithPoints(polygon) {

    // Polygon input
    // [
    //     {
    //         "start": {
    //             "lon": "10.0",
    //             "lat": "50.0"
    //         },
    //         "end": {
    //             "lon": "11.0",
    //             "lat": "51.0"
    //         }
    //     },
    //     {
    //         "start": {
    //             "lon": "11.0",
    //             "lat": "51.0"
    //         },
    //         "end": {
    //             "lon": "12.0",
    //             "lat": "52.0"
    //         }
    //     },
    // ]

    // Polygon output
    // [
    //     {
    //         "lon": "10.0",
    //         "lat": "50.0"
    //     },
    //     {
    //         "lon": "11.0",
    //         "lat": "51.0"
    //     },
    //     {
    //         "lon": "12.0",
    //         "lat": "52.0"
    //     }
    // ]


    if (polygon[0].start === undefined) {
        return null
    }

    let polygonWithCoordinates = [polygon[0].start]

    for (let polygonSegment in polygon) {
        polygonWithCoordinates.push(polygonSegment.end)
    }

    return polygonWithCoordinates
}


module.exports = {intersectsLineWithPolygon}
