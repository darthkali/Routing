function preload() {
    xml = loadXML('BeispielGPX.gpx');
}

function setup(){
    let positions = getLatLongFromGpx(childname = 'trkpt')

    for(const position of positions){
        print(position.lat)
        print(position.lon)
        print(position.ele)
    }
}