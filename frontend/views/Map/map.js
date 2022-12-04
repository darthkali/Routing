const mappa = new Mappa('Leaflet');
const options = {
    lat: 50.950186,
    lng: 11.039531,
    zoom: 10,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

//colors
const redColor = [255, 0, 0];
const greenColor = [0, 170, 30];
const blueColor = [0, 0, 170];
const blackColor = [0, 0, 0];


let myMap;
let canvas;
let data = {}
let drawCounter = 0;
let down;
let timeTaken = 0;
let coordinates = []

let pointSize = 10
let changed = false
let routeBoundingBox

let isRouteValid = true

window.preload = async function () {
    data = loadJSON('http://localhost:3000/getZones');
    data.relevantZones = []
}

window.setup = function () {
    canvas = createCanvas(displayWidth, displayHeight);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas)
}

window.draw = async function () {
    drawZones()
    drawRoute()
}


window.keyPressed = function () {
    if (keyCode === ESCAPE) {
        drawCounter = 0;
        coordinates = []
        data.relevantZones = []
    } else if (keyCode === RETURN) {
        if (coordinates.length >= 2) {
            data.relevantZones = []
            // sende ersten und letzten Punkt an Backend
            getRelevantZonesFromBackend()
            isRouteIntersects()
        } else {
            console.log("Um die Route zu bestimmen, müssen mindestens 2 Punkte vorhanden sein.")
        }
    } else if (keyCode === BACKSPACE) {
        coordinates.pop()
        changed = true
    }
}

window.mousePressed = function () {
    down = Date.now();
}
window.mouseReleased = function () {
    if ((timeTaken = Date.now() - down) < 200) {
        changed = true

        const pixelPos = myMap.pixelToLatLng(mouseX, mouseY);
        coordinates.push({lat: pixelPos.lat, lon: pixelPos.lng})
        drawCounter++;
    }
}

// Draw Functions
async function drawRoute() {
    if (coordinates.length > 0) {
        const startCoordinate = myMap.latLngToPixel(coordinates[0].lat, coordinates[0].lon)
        drawRoutePoint(startCoordinate)

        let lastCoordinate = startCoordinate
        for (const actualCoordinate of coordinates) {
            const actualCoordinateInPx = myMap.latLngToPixel(actualCoordinate.lat, actualCoordinate.lon) // [lon, lat]
            drawRouteLine(lastCoordinate,actualCoordinateInPx)
            drawRoutePoint(actualCoordinateInPx)
            lastCoordinate = actualCoordinateInPx
        }
        if (changed === true) {
            await calculateBoundingBoxOnServer()
            changed = false
        }
        drawBoundingBox(routeBoundingBox)
    }
}

function drawRoutePoint(coordinate) {
    strokeWeight(1);
    setLineDash([]);
    fill(200, 100, 100, 150);
    ellipse(coordinate.x, coordinate.y, pointSize, pointSize);
}

function drawRouteLine(startCoordinate, endCoordinate){
    strokeWeight(4);
    if (isRouteValid) {
        stroke(blueColor);
    } else {
        stroke(redColor);
    }

    line(startCoordinate.x, startCoordinate.y, endCoordinate.x, endCoordinate.y)
}

function drawZones(zones = data.zones, color = [100, 0, 0, 100]) {
    clear();
    strokeWeight(2);
    for (const zone of zones) {
        fill(color);
        setLineDash([]);
        beginShape();
        for (const coordinate of zone.coordinates) {
            const pixelPos = myMap.latLngToPixel(coordinate.lat, coordinate.lon) // [lon, lat]
            vertex(pixelPos.x, pixelPos.y)
        }
        endShape(CLOSE)
        drawBoundingBox(zone.boundingBox)
    }

    for (const zone of data.relevantZones) {
        fill(0, 100, 0, 100);
        setLineDash([]);
        beginShape();
        for (const coordinate of zone.coordinates) {
            const pixelPos = myMap.latLngToPixel(coordinate.lat, coordinate.lon) // [lon, lat]
            vertex(pixelPos.x, pixelPos.y)
        }
        endShape(CLOSE)
    }
}


function drawBoundingBox(boundingBox) {
    noFill()
    stroke(blackColor);
    strokeWeight(1);
    const pixelPosNorthWest = myMap.latLngToPixel(boundingBox.northWest.lat, boundingBox.northWest.lon)
    const pixelPosNorthEast = myMap.latLngToPixel(boundingBox.northEast.lat, boundingBox.northEast.lon)
    const pixelPosSouthWest = myMap.latLngToPixel(boundingBox.southWest.lat, boundingBox.southWest.lon)

    setLineDash([5, 5]);

    let width = pixelPosNorthEast.x - pixelPosNorthWest.x
    let height = pixelPosSouthWest.y - pixelPosNorthWest.y
    rect(pixelPosNorthWest.x, pixelPosNorthWest.y, width, height)
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}



// Backend Requests

async function calculateBoundingBoxOnServer(){
    let validCoordinates = '{"coordinates":' + JSON.stringify(coordinates) + '}'
    await axios.get('http://127.0.0.1:3000/calculateBoundingBox', {
        params: {
            coordinates: validCoordinates
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        routeBoundingBox = response.data
    })
    changed = false
}

async function getRouteFromBackend() {
    let result;
    await axios.get('http://localhost:3000/getRoute', {
        params: {
            startLon: coordinates[0].lon,
            startLat: coordinates[0].lat,
            endLon: coordinates.slice(-1)[0].lon,
            endLat: coordinates.slice(-1)[0].lat
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        result = response.data
    }).catch((error) => {
        console.log(error)
    })
    return result
}

async function getRelevantZonesFromBackend() {
    let result;
    let routeCoordinates = '{"coordinates":' + JSON.stringify(coordinates) + '}'
    await axios.get('http://localhost:3000/getRelevantZones', {
        params: {
            coordinates: routeCoordinates
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        result = response.data
    }).catch((error) => {
        console.log(error)
    })

    data.relevantZones = result
    return result
}

async function isRouteIntersects() {
    let data;
    let routeCoordinates = '{"coordinates":' + JSON.stringify(coordinates) + '}'
    await axios.get('http://localhost:3000/isRouteIntersects', {
        params: {
            coordinates: routeCoordinates
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        data = response.data
    }).catch((error) => {
        console.log(error)
    })

    isRouteValid = !data.result
}





