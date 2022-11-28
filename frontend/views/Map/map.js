const mappa = new Mappa('Leaflet');
const options = {
    lat: 50.950186,
    lng: 11.039531,
    zoom: 13,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

let myMap;
let canvas;
let mapCanvas
let data;
let drawCounter = 0;
let down;
let timeTaken = 0;
let coordinates = []
const redColor = [255, 0, 0];
const greenColor = [0, 255, 0];
let maxCoordinates = 10
let pointSize = 10
let changed = false
let routeBoundingBox
let clearButton;
let wasButtonPresses = false

window.preload = async function () {
    data = loadJSON('http://localhost:3000/getZones');
}

window.setup = function () {
    canvas = createCanvas(displayWidth, displayHeight);

    clearButton = createButton('Route löschen');
    clearButton.position(0, 0, 'fixed')
    clearButton.mousePressed(clearRoute);

    myMap = mappa.tileMap(options);
    myMap.overlay(canvas)


}

window.draw = async function () {
    drawZones()
    drawRoute()
}

function clearRoute() {
    wasButtonPresses= true
    drawCounter = 0;
    coordinates = []
}

async function drawRoute() {

    if (coordinates.length > 0) {
        setLineDash([]);
        fill(200, 100, 100, 150);
        const startCoordinate = myMap.latLngToPixel(coordinates[0].lat, coordinates[0].lon)
        ellipse(startCoordinate.x, startCoordinate.y, pointSize, pointSize);

        let lastCoordinate = startCoordinate
        for (const actualCoordinate of coordinates) {
            const actualCoordinateInPx = myMap.latLngToPixel(actualCoordinate.lat, actualCoordinate.lon) // [lon, lat]
            line(lastCoordinate.x, lastCoordinate.y, actualCoordinateInPx.x, actualCoordinateInPx.y)
            ellipse(actualCoordinateInPx.x, actualCoordinateInPx.y, pointSize, pointSize);
            lastCoordinate = actualCoordinateInPx
        }
    }
    if (coordinates.length > 1) {
        if (changed === true) {
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
            console.log(routeBoundingBox)
        }
        drawBoundingBox(routeBoundingBox)
    }
}

function drawZones() {
    clear();
    for (const zone of data.zones) {
        fill(200, 100, 100, 150);
        setLineDash([]);
        beginShape();
        for (const coordinate of zone.coordinates) {
            const pixelPos = myMap.latLngToPixel(coordinate.lat, coordinate.lon) // [lon, lat]
            vertex(pixelPos.x, pixelPos.y)
        }
        endShape(CLOSE)
        drawBoundingBox(zone.boundingBox)
    }
}


function drawBoundingBox(boundingBox) {
    noFill()
    const pixelPosNorthWest = myMap.latLngToPixel(boundingBox.northWest.lat, boundingBox.northWest.lon)
    const pixelPosSouthEast = myMap.latLngToPixel(boundingBox.southEast.lat, boundingBox.southEast.lon)
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

window.mousePressed = function () {
    down = Date.now();
}
window.mouseReleased = function () {

    if ((timeTaken = Date.now() - down) < 200 && wasButtonPresses === false) {
        changed = true
        if (drawCounter < maxCoordinates) {
            const pixelPos = myMap.pixelToLatLng(mouseX, mouseY);
            coordinates.push({lat: pixelPos.lat, lon: pixelPos.lng})
            drawCounter++;
        } else {
            clear();
            clearRoute();
        }
    }
    wasButtonPresses = false
}

