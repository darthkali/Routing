let data
let geoJsonHandler
let xml

function preload() {
    geoJsonHandler = new GeoJsonHandler();
    gpxHandler.loadGpxFile('BeispielGPX.gpx');
}

function setup() {
    data = gpxHandler.getLatLongFromGpx('trkpt');

    for (const position of data) {
        print(position.lat)
        print(position.lon)
        print(position.ele)
    }
}