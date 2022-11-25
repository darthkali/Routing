let myMap;
let canvas;
const mappa = new Mappa('Leaflet');
const options = {
    lat: 50.950186,
    lng: 11.039531,
    zoom: 13,
    style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

let data;
let polygons;

let drawCounter = 0;
let startPoint = {x: null, y: null}
let endPoint = {x: null, y: null}
let down;
let timeTaken = 0;

const redColor = [255, 0, 0];
const greenColor = [0, 255, 0];

window.preload = function () {
    // Load a GeoJSON file using p5 loadJSON.
    data = loadJSON('../../resources/example.geojson');
}


window.setup = function () {
    canvas = createCanvas(1680, 1090);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas)

    fill(200, 100, 100, 150);

    polygons = myMap.geoJSON(data, 'Polygon')
    console.log(data)
    console.log(polygons)
}

window.draw = function () {
    drawPolygons()

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

function drawPolygons() {

    // console.log(polygons)                   // [[[[82, 68],[82, 68],[82, 68]]],[[[82, 68],[82, 68],[82, 68]]],[[[82, 68],[82, 68],[82, 68]]]]
    // console.log(polygons[0])                // [[[82, 68],[82, 68],[82, 68]]]
    // console.log(polygons[0][0])             // [[[82, 68],[82, 68],[82, 68]]]
    // console.log(polygons[0][0][0])          // [[82, 68],[82, 68],[82, 68]]
    // console.log(polygons[0][0][0][0])       // [82, 68]
    // console.log(polygons[0][0][0][0][0])    // 82

    clear();
    for (const polygon of polygons) {
        drawPolygon(polygon[0][0])
    }
}

function drawPolygon(polygon) {
    beginShape();

    for (const point of polygon) {
        const pixelPos = myMap.latLngToPixel(point[1], point[0]) // [lon, lat]
        vertex(pixelPos.x, pixelPos.y)
    }
    endShape(CLOSE)
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
