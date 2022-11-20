const convert = require('xml-js');
const fs = require("fs");

let data
let xmlFile = null;
let jsondata = null;

function loadGpxFile(gpxFile) {
    // read file
    xmlFile = fs.readFileSync('BeispielGPX.gpx', 'utf8');
    jsondata = JSON.parse(convert.xml2json(xmlFile, {compact: true, spaces: 2}));
}

function saveToFile() {
    //const name = this.xmlFile.getChildren("name")
    const name = jsondata.gpx.trk.name._text;
    fs.writeFile(name + '_edited.xml', convert.json2xml(JSON.stringify(jsondata), {compact: true, spaces: 2}), (err) => {
        if (err) console.log(err);
    });
}

function getLatLongFromGpx(childname) {
    let { gpx } = jsondata
    let { trk } = gpx
    let { trkseg } = trk

    //console.log(trkseg)
    let jsData = trkseg[childname];
    let data = []

    for (let i = 0; i < jsData.length; i++) {
        //let lat = xmlData[i].getString('lat');
        let lat = jsData[i]._attributes['lat'];
        //let lon = xmlData[i].getString('lon');
        let lon = jsData[i]._attributes['lon'];
        //let ele = xmlData[i].getContent();
        let ele = jsData[i].ele._text;

        data.push({lat: lat, lon: lon, ele: ele})
    }
    return data
}

loadGpxFile('BeispielGPX.gpx');

data = getLatLongFromGpx('trkpt');

for (const position of data) {
    console.log('Lat: ' + position.lat
            + ', Lon: ' + position.lon
            + ', Ele: ' + position.ele
    )
    // edit content to show that saving works
    position.lon = position.lon + 4
}

saveToFile()