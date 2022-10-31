# Routing


## Höhendaten
Die APIs, welche Höhendaten liefern, geben diese nur für den Bodenwert aus. Gebäude werden dabei nicht berücksichtigt. Wir benötigen hier also eine andere Lösung.

### Erfurt Höhendaten
Radisson Hotel ist das höchste Hotel in Erfurt. Rund 60 - 70 m. Flughöhe kann zwischen 90 - 120 m sein.

### Typische Flughöhen
| Höhe über GND         | Objekte in der Luft                                                                                                                                            |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0 m bis 100 m         | Vögel, Fledermäuse, Insekten, Drachen; gefesselte Ballons (auch zeppelinförmige) für Werbung, Beleuchtung, Kameras                                             |
| 150 m bis 1500 m      | Luftsportgeräte, Hängegleiter, Gleitschirme, Heißluftballone, Hubschrauber, Luftschiffe                                                                        |
| 1500 m bis 3000 m     | Kleinflugzeuge im Reiseflug, Segelflugzeuge im Streckenflug, Verkehrsflugzeuge in Warteschleifen zum Landeanflug                                               |
| 3000 m bis 5000 m     | Absprung von Fallschirmspringern (üblicherweise 4000 m), Geschäftsflugverkehr, manche Zugvögel                                                                 |
| 5000 m bis 10000 m    | Geschäftsflugverkehr, Düsenflugzeuge und Turbopropflugzeuge im Reiseflug (FL 150 bis FL 290)                                                                   |
| 10000 m bis 15000 m   | Düsenverkehrsflugzeuge im Reiseflug (FL 300 bis FL 450)                                                                                                        |
| 15000 m bis > 18000 m | Überschallpassagierflugzeuge wie die Concorde und die Tupolew Tu-144. Sehr leichte, unbemannte von Solarzellen angetriebene Pseudo-Satelliten (Airbus Zephyr). |
Quelle: https://de.wikipedia.org/wiki/Flugh%C3%B6he

### Höchste Gebäude
| Name | Höhe | Bezogen auf|Link|
|----------|----------|----------|----------|
|Burj Khalifa|828 m|Welt|https://de.wikipedia.org/wiki/Liste_der_h%C3%B6chsten_Hochh%C3%A4user_der_Welt|
|Berliner Fernsehturm|368 m|Deutschland|https://de.wikipedia.org/wiki/Liste_der_h%C3%B6chsten_Bauwerke_in_Deutschland|

### Lösungsidee
Man könnte sich im Bereich von 1000 - 1500 m aufhalten. Dann wäre man erst im 2. Flugsektor aber schon über dem höchsten Gebäude. Problem dabei ist es, dass Drohnen nur bis 120 m hoch fliegen dürfen.

## Berechnung der Route
![PXL_20221025_131942869 MP](https://user-images.githubusercontent.com/46423967/197785234-0a2decf9-b9de-4b40-b31e-e345f64973c7.jpg)
![PXL_20221025_131948368 MP](https://user-images.githubusercontent.com/46423967/197785150-a1bc7531-ba1d-4818-b557-894b14246f75.jpg)

## Ausgabe
Bei der Ausgabe gibt es mehrere Formate, welche infrage kommen können: csv, gpx, geojson und kml. Dabei sind gpx und kml die am meist verwendeten Formate und auch die universellsten. Gmx wird von fast jedem Gerät bzw jeder Software erkannt. Kml, was ursprünglich von Google stammt, muss ggf erst in Gpx umgewandelt werden. Diese Umwandlung kann mit [GPSBabel](https://de.wikipedia.org/wiki/GPSBabel) erfolgen.

**Aus diesem Grund werden wir direkt mit GPX arbeiten.**

**Quellen:**
- [GPX vs KML](https://support.cluetrust.com/hc/en-us/articles/201688457-What-s-the-difference-between-GPX-and-KML-formats-)
- [wegeundpunkte.de](https://www.wegeundpunkte.de/gps.php?content=dateiformate)

![PXL_20221025_133338554 MP](https://user-images.githubusercontent.com/46423967/197787569-cc2469f5-e629-46cc-945c-fde6ee90a6e0.jpg)



## Links
- [openlayers](https://openlayers.org/)
- [Open Flight Map](https://www.openflightmaps.org/ed-germany/)
- [Open Flight Map - GitLab](https://gitlab.com/openflightmaps/ofmx/-/wikis/home)
- [ArduPilot](https://ardupilot.org/copter/docs/common-choosing-a-ground-station.html)
- [ArduPilot - GitHub](https://github.com/ArduPilot/MissionPlanner)
- [Flightplan Topic GitHub](https://github.com/topics/flightplan)
- [Betaflight](https://github.com/AaronBalint/betaflight_plan)
- [Höhenprofil - cgiar](https://srtm.csi.cgiar.org/)
- [Brouter Fahrrad](https://github.com/abrensch/brouter)



