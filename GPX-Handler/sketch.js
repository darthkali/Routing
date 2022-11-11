let data
let gpxHandler
let xml

function preload() {
    gpxHandler = new GpxHandler();
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