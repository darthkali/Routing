# Routing

## Höhendaten
Die APIs, welche Höhendaten liefern, geben diese nur für den Bodenwert aus. Gebäude werden dabei nicht berücksichtigt. Wir benötigen hier also eine andere Lösung.

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
|Berliner Fernsehturm|368 m|Welt|https://de.wikipedia.org/wiki/Liste_der_h%C3%B6chsten_Bauwerke_in_Deutschland|

### Lösungsidee
Man könnte sich im Bereich von 1000 - 1500m aufhalten. Dann wäre man erst im 2. Flugsektor aber schon über dem Höchsten Gebäude. Problem dabei ist es, dass Drohnen nur bis 120m hoch fliegen dürfen.

## Open Flight Map
https://www.openflightmaps.org/ed-germany/

## ArduPilot
https://ardupilot.org/copter/docs/common-choosing-a-ground-station.html
https://github.com/ArduPilot/MissionPlanner


## Flightplan Topic GitHub
https://github.com/topics/flightplan


## Betaflight
https://github.com/AaronBalint/betaflight_plan

## Höhenprofil
https://srtm.csi.cgiar.org/

## Brouter Fahrrad
https://github.com/abrensch/brouter
