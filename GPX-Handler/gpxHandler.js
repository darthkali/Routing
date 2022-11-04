let xml;

function getLatLongFromGpx(childname,) {
    let xmlData = xml.getChildren(childname);
    let data = []

    for (let i = 0; i < xmlData.length; i++) {
        let lat = xmlData[i].getString('lat');
        let lon = xmlData[i].getString('lon');
        let ele = xmlData[i].getContent();
        data.push({lat: lat, lon: lon, ele: ele})
    }
    return data
}
