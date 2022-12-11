const axios_lib = require("axios");
const {response} = require("express");

const SAMPLE_DISTANCE = 0.3         // Lat/Lon Distanz
// relative Zielflughöhe: 100m bis 200m --> ~150m
const MIN_ALTITUDE = 100            // minimale Flughöhe über Boden
const MAX_ALTITUDE = 200            // maximale Flughöhe über Boden
const SAFETY_MAX_DEVIATION = 0.3    // Faktor für Höhentoleranz
// tolerierter Bereich: 150m +- 30m --> 120m bis 180m
const TARGET_ALTITUDE = (MIN_ALTITUDE + MAX_ALTITUDE) / 2
const TARGET_MIN_ALTITUDE = TARGET_ALTITUDE - (SAFETY_MAX_DEVIATION * (MAX_ALTITUDE - MIN_ALTITUDE))       // 150m - 0.3 * 100m = 120m
const TARGET_MAX_ALTITUDE = TARGET_ALTITUDE + (SAFETY_MAX_DEVIATION * (MAX_ALTITUDE - MIN_ALTITUDE))       // 150m + 0.3 * 100m = 180m

// Route {'coordinates': [          {'lat': 50.123, 'lon': 48.5543, 'ele': 270},  {'lat': 50.123, 'lon': 45.5543, 'ele': 270},  {'lat': 50.123, 'lon': 41.5543, 'ele': 301} ],
//   'heightProfileRaw': [          [111, 108, 114, 120, 119, 102],               [111, 108, 133, 120, 119, 102],               [111, 108, 114, 120, 151, 132]              ],
//                                 <<< wir könnten als Rohwerte auch {lat:, lon:, ele:} pro Abtastpunkt speichern >>>
//   'heightProfileMax': [          120,                                          133,                                          151                                         ],
//   'heightProfileSmoothened': [   270,                                          270,                                          (270) 301                                   ],
//      //  //  //   rel. Höhe:     150 (passt)                                   137 (passt)                                   (119 - zu klein) 150
// }

async function elevateRoute(route) {
    // gerasterte Höhendaten
    route.heightProfileRaw = await getSampledRawHeightData(route)
    route.heightProfileMax = getHeightProfileMax(route.heightProfileRaw)
    route.heightProfileSmoothened = getHeightProfileSmoothened(route.heightProfileMax)

    integrateElevation(route, route.heightProfileSmoothened)
    return route
}

function integrateElevation(route, heightProfileSmoothened) {
    if (route.coordinates.length === heightProfileSmoothened.length) {
        for (let i = 0; i < route.coordinates.length; ++i) {
            route.coordinates[i].ele = heightProfileSmoothened[i]
        }
    } else {
        console.log('integrateElevation: nCoordinates != nElevations')
    }
}

function getHeightProfileSmoothened(heightProfileMax) {
    let profileSmoothened = []
    let currentHeight = heightProfileMax[0] + TARGET_ALTITUDE

    for (let i = 0; i < heightProfileMax.length - 1; ++i) {
        if (!(currentHeight >= heightProfileMax[i] + TARGET_MIN_ALTITUDE && currentHeight <= heightProfileMax[i] + TARGET_MAX_ALTITUDE)) {
            currentHeight = heightProfileMax[i] + TARGET_ALTITUDE
        }
        profileSmoothened.push(currentHeight)
    }
    profileSmoothened.push(profileSmoothened[profileSmoothened.length - 1])
    return profileSmoothened
}

function getHeightProfileMax(heightProfileRaw) {
    let profileMax = []
    for (let i = 0; i < heightProfileRaw.length - 1; ++i) {
        profileMax.push(Math.max(...heightProfileRaw[i]))
    }
    // kopiere letzte berechnete Höhe auf allerletzten Punkt
    profileMax.push(profileMax[profileMax.length - 1])
    return profileMax;
}

async function getSampledRawHeightData(route) {
    let routeRawEle = []
    let samplePoints = []
    let samplePointsCoordinateIndex = []    // Zuordnung zu ursprgl. Koordinatenpaar

    for (let coordinateIndex = 0; coordinateIndex < route.coordinates.length - 1; ++coordinateIndex) {
        routeRawEle[coordinateIndex] = []
        let point1 = route.coordinates[coordinateIndex]
        let point2 = route.coordinates[coordinateIndex + 1]
        let distanceLat = point2.lat - point1.lat
        let distanceLon = point2.lon - point1.lon
        let distance = Math.sqrt(Math.pow(distanceLat, 2) + Math.pow(distanceLon, 2))

        // Schrittweite pro Achse müssen wir nicht mit quadratischer Gleichung lösen, denn
        // SAMPLE_DISTANCE : distance = stepLat : distanceLat = stepLon : distanceLon
        let stepLat = distanceLat * SAMPLE_DISTANCE / distance
        let stepLon = distanceLon * SAMPLE_DISTANCE / distance

        //let ratioLatByLon = distanceLat / distanceLon

        for (let sampleIndex = 0; Math.abs(sampleIndex * stepLat) < Math.abs(distanceLat); ++sampleIndex) {
            let pt = {}
            pt.lat = point1.lat + sampleIndex * stepLat
            pt.lon = point1.lon + sampleIndex * stepLon
            samplePoints.push(pt)
            samplePointsCoordinateIndex.push(coordinateIndex)
        }
        // Endpunkt auch berücksichtigen
        samplePoints.push({'lat': point2.lat, 'lon': point2.lon})
        samplePointsCoordinateIndex.push(coordinateIndex)
    }
    let allElevations = await getElevationsForMultiplePoints(samplePoints)
    for (let i=0; i < allElevations.length; ++i) {
        routeRawEle[samplePointsCoordinateIndex[i]].push(allElevations[i])
    }
    routeRawEle.push([])    // letzter Punkt hat kein Segment und deshalb keine Höhendaten
    return routeRawEle
}

async function getElevationForPoint(point) {
    // https://api.open-elevation.com/api/v1/lookup?locations=40.7855654523992,-73.96286038748994
    let url = `https://api.open-elevation.com/api/v1/lookup?locations=`
    url += point.lat + `,` + point.lon

    let data
    await axios_lib.get(url, {
        headers: {
            Accept: 'application/json', 'Accept-Encoding': 'application/json'
        },
    }).then((response) => {
        data = response.data

    }).catch((error) => {
        console.log(error)
    })

    return data.results[0].elevation
}

async function getElevationsForMultiplePoints(arrPoints) {
    let url = `https://api.open-elevation.com/api/v1/lookup`

    let locations = []
    for (let pt of arrPoints) {
        let jsonPoint = {}
        jsonPoint.latitude = pt.lat
        jsonPoint.longitude = pt.lon
        locations.push(jsonPoint)
    }

    let data

    // await axios_lib.post(url, {
    //     headers: {
    //         'Accept': 'application/json',
    //         'Accept-Encoding': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     locations: locations
    // }).then((response) => {
    //     console.log(response)
    //     data = response.data
    //
    // }).catch((error) => {
    //     console.log(error)
    // })
    // console.log(' ')
    // console.log(data)
    // https://stackoverflow.com/questions/72343387/axios-not-sending-headers-request-failing-getting-401-error
    await axios_lib({
        method: "post",
        url: url,
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Accept-Encoding': 'application/json',
        },
        data: {'locations': locations},
    }).then((response) => {
        data = response.data

    }).catch((error) => {
        console.log(error)
    })

    let elevations = []
    for (let point of data.results) {
        elevations.push(point.elevation)
    }
    return elevations
}


module.exports = {elevateRoute}

