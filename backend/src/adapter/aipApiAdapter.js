const boundingBox_lib = require('../gemoetry/boundingBox.js')
const axios_lib = require("axios");

function parseAipGeoJsonToZones(aipGeoJson) {
    let zones = [];
    for (let item of aipGeoJson.items) {
        let coordinates = []

        for (let coordinate of item.geometry.coordinates[0]) {
            coordinates.push({lon: coordinate[0], lat: coordinate[1]})
        }

        let name = item.name !== undefined ? item.name : "undefined"

        let zone = {
            "name": name,
            "boundingBox": boundingBox_lib.calculateBoundingBox(coordinates),
            "coordinates": coordinates
        };
        zones.push(zone);
    }

    return {"zones": zones};
}

async function loadDataFromOpenAip() {
    let apiKey = process.env.API_KEY

    // type 0 = Landesgrenzen
    // type 1 = Militärisches Gebiet
    // type 2 = ???
    // type 3 = ???
    // type 4 = Flughäfen
    // type 5 = ???
    let types = "type=1&type=4"
    let url = `https://api.core.openaip.net/api/airspaces?page=1&limit=1000&fields=name%2C%20geometry&pos=50.950186%2C11.039531&dist=1500000&sortBy=name&sortDesc=true&country=DE&approved=true&searchOptLwc=true&${types}&apiKey=${apiKey}`
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
    return parseAipGeoJsonToZones(data)
}


module.exports = {parseAipGeoJsonToZones, loadDataFromOpenAip}

