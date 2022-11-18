let data
let geoJsonHandler
let xml



    console.log("loadGeoJsonFile");
    geoJsonParser = new GeoJsonParser();
    console.log("loadGeoJsonFile");
    geoJsonParser.loadGeoJsonFile();
    data = geoJsonParser.getGeoJson()
    console.log(data);
    for (const position of data) {
        print(position.lat)
        print(position.lon)
        print(position.ele)
    }
