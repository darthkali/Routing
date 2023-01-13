Was muss geschrieben werden, damit jemand anderes versteht was wir gemacht haben
- Worum geht es
- Ich bin Experte?
- Anreiz schaffen, dass er Interesse hat
- aktueller Stand
- offene Themen
    - wo gehts weiter
    - was sind so Probleme

# _Abstract---_

# Einleitung
- Projekteinordnung Blutprobe, dementsprechende Einschränkungen und Relevanz
- aber betonen, dass die Technologie auch in jedem anderen Kontext funktioniert und gebraucht wird
- warum ist Drohnenrouting wichtig
- warum ist es schwierig

# Routing
## Geo-Informations-Grundlagen
- Longitude, Latitude
- Höhendaten: Luftraum / Flughöhe (Gesetze) -- 150m
- Datenquellen Höhendaten, Sperrzonen, Kartendaten
- höchstes Bauwerk: Fernsehturm 368m > 150m -> Kollisionserkennung notwendig
- Sperrzonen


## Algorithmik
- GeoJSON als Standard/Format
- Recheneffizienz (BoundingBox), relevant Zones
- Abtastung der Route für Höhe
- Threshold bei Höhe (Routeneffizienz)
- offene Probleme: konkave Situationen und Optimierung der Route, Höhe

## Visualisierung
- wichtig zur Nachvollziehbarkeit der Korrektheit
- und zur Veranschaulichung / Erklärung der Vorgänge

# Fazit
- vermeintlich einfaches Thema komplexer als gedacht
- widersprüchliche Standards = frech -- viele Entscheidungen zu treffen, da keine Einheitlichkeit in der Welt
- Geometry-Library verwenden
- Proof of Concept
- weitere Optimierung = hoher Aufwand
- angenehmes und spannendes Thema