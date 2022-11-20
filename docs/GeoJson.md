# GeoJSON

https://geojson.org/

GeoJson unterstützt die folgenden Typen:

- Point
- LineString
- **Polygon**
- MultiPoint
- MultiLineString
- MultiPolygon

Man kann diesen einfachen Objekten weitere Eigenschaften (Properties) zuordnen. Diese stellen dann zusammen ein **
Feature** dar.
Mehrere solcher Features werden in einer **FeatureCollection** zusammengefasst.

Die Eigenschaften können selbst gewählt werden.

## Beispiel GeoJSON

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
        ]
      },
      "properties": {
        "creator": "Routing-0.0.1",
        "name": "BeispielGeoJSON",
        "track-length": "42457",
        "messages": [
          [
            "Longitude",
            "Latitude",
            "Elevation"
          ],
          [
            "9907851",
            "51203074",
            "320"
          ]
        ],
        "times": [
          0,
          18.124,
          32.011,
          43.177,
          45.647,
          48.751
        ]
      }
    },
    {
      ...
    }
  ]
}
```

## Routing Format für die Drohne

Für unsere Routing und die damit verbundenen Zonen benötigen wir als Typ lediglich Poygone und die **Bounding Box** als
Eigenschaft.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [431, 400],
            [176, 50],
            [50, 136],
            [300, 150]
          ]
        ]
      },
      "properties": {
        "name": "PolyTest1",
        "boundingBox": {
          "leftTop": {
            "lon": 50
            "lat": 400
          },
          "rightBottom": {
            "lon": 431
            "lat": 50
          }
        }
      }
    }
  ]
}


```

## Bounding Box

Um die Suche nach dem Polygon zu vereinfachen, brauchen wir die Box, welche ein Polygon an deren maximalen sowie
minimalen Grenzen umschließt.
![Bounding Box](../assets/bounding-box.jpeg)

### Properties der BoundingBox in einem Feature

```json
{
  "bounding-box": {
    "left-top": {
      "lon": 50,
      "lat": 500
    },
    "right-bottom": {
      "lon": 500,
      "lat": 50
    }
  }
}
```

Die jeweiligen Werte berechnen sich aus den Minima- bzw Maximawerten aller Punkte des Polygons.

```js
leftTopLat = max(Polygon.lat)
leftTopLon = min(Polygon.lon)
rightBottomLat = min(Polygon.lat)
rightBottomLon = max(Polygon.lon)
```

### Finde alle Zonen, die für den Punkt relevant seien können

#### Ideen

BoundingBox um unseren Start- und Endpunkt + jeweils einen Offset von 10 km in alle Richtungen. Und nur noch die Zonen
nehmen, die innerhalb dieser Box liegen.

```js
function findRelevantZones(Point) {
    let relevantZones = [];
    for (let i = 0; i < this.geoJson.length; i++) {
        if (this.isCoordinateInBoundingBox(this.geoJson[i], Point)) {
            relevantZones.push(this.geoJson[i]);
        }
    }
    return relevantZones;
}
```

### Prüfe ob ein Punkt in der BoundingBox liegt

Um herauszufinden, ob ein Punkt innerhalb einer BoundingBox liegt, kann mit 2 Varianten umgesetzte werden:

#### RayCast Algorithmus

Wenn wir den [RayCast Algorithmus](../Ray-Casting-Algorithm) nutzen, haben wir ein einheitliches Vorgehen, dieser
ist aber zeitaufwendig und bei **gerade im Raum liegenden Rechtecken** nicht effizient.

#### Eigene Funktion

Eine schlankere und auch schnellere Methode wäre es einfach zu prüfen ob der ausgewählte Punkt sich zwischen den
einzelnen Eckpunkten der BoundingBox befindet.

```js
function isCoordinateInBoundingBox(zone, coordinate) {
    return zone.properties.boundingBox.leftTop.lat > coordinate.lat &&
        zone.properties.boundingBox.leftTop.lon < coordinate.lon &&
        zone.properties.boundingBox.rightBottom.lat < coordinate.lat &&
        zone.properties.boundingBox.rightBottom.lon > coordinate.lon;
}
```

Da wir in diesem Fall in der If-Abfrage nur mit
dem [AND-Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) arbeiten,
wird die Berechnung beim ersten `false` abgebrochen. Somit ist diese Version im Idealfall schon nach der ersten Abfrage
beendet und die anderen werden nicht weiter betrachtet.
