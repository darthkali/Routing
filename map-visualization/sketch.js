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

function preload() {
    // Load a GeoJSON file using p5 loadJSON.
    data = loadJSON('example.geojson');
}


function setup() {
    canvas = createCanvas(1680, 1090);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas)

    fill(200, 100, 100, 150);


    polygons = myMap.geoJSON(data, 'Polygon')
    myMap.onChange(drawPolygons)
}

function draw() {

}

function drawPolygons() {

    // console.log(polygons)                   // [[[[82, 68],[82, 68],[82, 68]]],[[[82, 68],[82, 68],[82, 68]]],[[[82, 68],[82, 68],[82, 68]]]]
    // console.log(polygons[0])                // [[[82, 68],[82, 68],[82, 68]]]
    // console.log(polygons[0][0])             // [[[82, 68],[82, 68],[82, 68]]]
    // console.log(polygons[0][0][0])          // [[82, 68],[82, 68],[82, 68]]
    // console.log(polygons[0][0][0][0])       // [82, 68]
    // console.log(polygons[0][0][0][0][0])    // 82

    clear();
    for(const polygon of polygons) {
        drawPolygon(polygon[0][0])
    }
}

function drawPolygon(polygon) {
    beginShape();

    for(const point of polygon) {
        const pixelPos = myMap.latLngToPixel(point[0], point[1])
        vertex(pixelPos.x, pixelPos.y)
    }
    endShape(CLOSE)
}


function drawPoint() {
    clear();

    const nigeria = myMap.latLngToPixel(11.396396, 5.076543);
    // ellipse(nigeria.x, nigeria.y, 20, 20);
}