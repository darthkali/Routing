
const mappa = new Mappa('Leaflet');
const options = {
    lat: 50.950186,
    lng: 11.039531,
    zoom: 13,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

let myMap;
let canvas;
let data;
let drawCounter = 0;
let startPoint = {x: null, y: null}
let endPoint = {x: null, y: null}
let down;
let timeTaken = 0;

const redColor = [255, 0, 0];
const greenColor = [0, 255, 0];

window.preload = function () {
    data = loadJSON('http://localhost:3000/getZones');
}

window.setup = function () {
    canvas = createCanvas(displayWidth, displayHeight);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas)

}

window.draw = function () {
    drawZones()


    if (startPoint.x !== null && startPoint.y !== null && endPoint.x !== null && endPoint.y !== null) {
        const pixelPosStartPoint = myMap.latLngToPixel(startPoint.x, startPoint.y)
        const pixelPosEndPoint = myMap.latLngToPixel(endPoint.x, endPoint.y)

        line(pixelPosStartPoint.x, pixelPosStartPoint.y, pixelPosEndPoint.x, pixelPosEndPoint.y)
        ellipse(pixelPosEndPoint.x, pixelPosEndPoint.y, 5, 5)
    }
    if (startPoint.x !== null && startPoint.y !== null) {
        const pixelPosStartPoint = myMap.latLngToPixel(startPoint.x, startPoint.y)
        ellipse(pixelPosStartPoint.x, pixelPosStartPoint.y, 5, 5)
    }
}

function drawZones() {
    fill(200, 100, 100, 150);

    clear();
    for (const zone of data.zones) {
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
    const pixelPosNorthWest = myMap.latLngToPixel(boundingBox.northWest.lat, boundingBox.northWest.lon)
    const pixelPosSouthEast = myMap.latLngToPixel(boundingBox.southEast.lat, boundingBox.southEast.lon)

    setLineDash([5, 5]);
    ellipse(pixelPosNorthWest.x, pixelPosNorthWest.y, 5, 5)
    line(pixelPosNorthWest.x, pixelPosNorthWest.y, pixelPosSouthEast.x, pixelPosNorthWest.y)

    ellipse(pixelPosSouthEast.x, pixelPosNorthWest.y, 5, 5)
    line(pixelPosSouthEast.x, pixelPosNorthWest.y, pixelPosSouthEast.x, pixelPosSouthEast.y)

    ellipse(pixelPosSouthEast.x, pixelPosSouthEast.y, 5, 5)
    line(pixelPosSouthEast.x, pixelPosSouthEast.y, pixelPosNorthWest.x, pixelPosSouthEast.y)

    ellipse(pixelPosNorthWest.x, pixelPosSouthEast.y, 5, 5)
    line(pixelPosNorthWest.x, pixelPosSouthEast.y, pixelPosNorthWest.x, pixelPosNorthWest.y)

}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

window.mousePressed = function () {

    down = Date.now();
}
window.mouseReleased = function () {

    if ((timeTaken = Date.now() - down) < 200) {
        if (drawCounter === 0) {
            const pixelPos = myMap.pixelToLatLng(mouseX, mouseY);
            startPoint.x = pixelPos.lat
            startPoint.y = pixelPos.lng
            drawCounter++;
        } else if (drawCounter === 1) {
            const pixelPos = myMap.pixelToLatLng(mouseX, mouseY);

            endPoint.x = pixelPos.lat
            endPoint.y = pixelPos.lng


            axios.get(`http://localhost:3000/getRouteTest?latStart=${startPoint.x}&lonStart=${startPoint.y}&latEnd=${endPoint.x}&lonEnd=${endPoint.y}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.data.result) {
                    fill(greenColor);
                } else {
                    fill(redColor);
                }
                ellipse(startPoint.x, startPoint.y, 20, 20);
            })


            drawCounter++;
        } else if (drawCounter === 2) {
            clear();
            drawCounter = 0;
            endPoint.x = null
            endPoint.y = null
            startPoint.x = null
            startPoint.y = null
        }
    }
}

