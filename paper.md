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

Grundlegende Problemstellung sei der Transport von Blutproben zwischen Unfallort und Labor durch ein speziell zu diesem Zweck entwickeltes Fluggerät.
Bestenfalls könnte bei Eintreffen eines verunfallten Patienten im Krankenhaus nicht nur die Blutanalyse bereits durchgeführt sein.
Sogar die passenden Blutkonserven könnten zuvor zur Verfügung gestellt worden sein.
Der Erfolg der Behandlung schwerer Verletzungen und damit auch die Überlebenschancen von Unfallopfern würden hierdurch gesteigert.

Aus der Problemstellung ergeben sich folgende Anforderungen an das Fluggerät:
Um in Innenstädten agieren zu können, muss es sich um ein VTOL (Vertical Take Off and Landing) handeln.
Das Fluggerät soll zudem eine hohe Reichweite haben, was hauptsächlich durch die Möglichkeit zum Gleitflug erreicht werden kann.
Beschleunigungskräfte müssen durch langsamere Geschwindigkeitsänderungen reduziert werden, um die Blutproben zu erhalten.
Rechtliche Aspekte sollen zunächst außer Acht gelassen werden.

Diese Arbeit setzt sich mit der Planung der Flugroute auseinander.
Insbesondere müssen dazu Höhendaten und Gebiete mit beschränktem Flugbetrieb berücksichtigt werden.
Ferner wird auf algorithmische Ansätze zur Umgehung besagter Verbotszonen, sowie Relevanz und Umsetzung der Visualisierung des Projekts, eingegangen.
Die Ergebnisse sind dabei unmittelbar auch in anderen Projekten einsetzbar.

# Routing
## Geo-Informations-Grundlagen
- Longitude, Latitude
- Höhendaten: Luftraum / Flughöhe (Gesetze) -- 150m
- Datenquellen Höhendaten, Sperrzonen, Kartendaten
- höchstes Bauwerk: Fernsehturm 368m > 150m -> Kollisionserkennung notwendig
- Sperrzonen

Geo-informationstechnische Grundlagen

Jeder Punkt auf der Erdkugel wird eindeutig durch die Kombination eines Breiten- und eines Längengrades definiert.
Breitengrade (Latitudes) liegen stets im Bereich von -90° (Süden) bis 90° (Norden). 0° beschreibt den Äquator.
Längengrade (Longitudes) werden von -180° (westlich) bis 180° (östlich) angegeben. Bei 0° befindet sich der Nullmeridian (Prime Meridian), welcher durch Greenwich (GB) verläuft.
Hierbei ergibt sich ein wesentliches mathematisches Problem.
Da -180° und +180° aufeinanderliegen, ist die rein mathematische Differenz zweier unmittelbar um diesen Meridian gelegenen Punkte größer als jede andere Differenz zweier Punkte.
Ein weiteres Problem ist die Uneinigkeit verschiedener Spezifikationen und Normen über die Reihenfolge der beiden Werte.
In diesem Projekt wird stets mit <longitude, latitude> gearbeitet.

https://user-images.githubusercontent.com/46423967/201349758-b2b38292-d0ef-463d-8b7d-c7b21fb459c4.png

Für die Erfassung von Höhendaten gab es in der Vergangenheit verschiedene Projekte und Techniken.
Darunter fallen beispielsweise Lidar, Radar und Stereo-Photogrammetrie. Die so ermittelten Datensätze werden wiederum von verschiedenen Anbietern zur Verfügung gestellt.



## Algorithmik
- GeoJSON als Standard/Format
- Recheneffizienz (BoundingBox), relevant Zones
- Abtastung der Route für Höhe
- Threshold bei Höhe (Routeneffizienz)
- offene Probleme: konkave Situationen und Optimierung der Route, Höhe




- ![img.png](paper/images/architektur.png)
- ![img.png](paper/images/map-germany.png)
- ![img.png](paper/images/routing-algo.png)
- ![img.png](paper/images/boundingbox.png)
- ![img.png](paper/images/konkaves-problem.png)



## Visualisierung
![img.png](paper/images/final-map-with-routing-and-height-profile.jpg)

In diesem Abschnitt wird die Visualisierung der Karte mit Sperrzonen und Routen beschrieben. Die interaktive Visualisierung ermöglicht es dem Nutzer, mit der Maus Start-, Zwischen- und Endpunkte zu setzen, um die Route berechnen zu lassen. Als Programmiersprache wurde P5JS verwendet, welches ein einfaches Framework zur Visualisierung von geometrischen Formen als Webanwendung direkt im Browser ist. Für das Arbeiten mit interaktiven Karten wurde Mappa.JS als Framework gewählt wurde, da es ursprünglich für P5JS entwickelt wurde und somit eine gute Integration bietet.

Der Zeichenbereich setzt sich aus zwei Bereichen zusammen.
Im oberen Bereich der Visualisierung wird ein Höhenprofil der Route dargestellt, sowie ein Korridor, innerhalb dessen sich die Drohne bewegen darf. Dieser Korridor hängt von der Höhe der Drohne und der Bodenhöhe ab.
Im unteren Bereich befindet sich dann die interaktive Karte, auf der die Sperrzonen und die Route dargestellt werden.

Jede Route und Sperrzone ist dabei ein Array von Koordinaten, die in der Karte dargestellt werden. Routen werden in der Karte mit einem blauen Pfad dargestellt, während Sperrzonen als rote Bereiche dargestellt werden.

Diese Visualisierung war nicht direkter Bestandteil der Arbeit,  stellte sich jedoch als wichtig für die Nachvollziehbarkeit der Korrektheit der Berechnungen sowie zur Veranschaulichung und Erklärung der Vorgänge heraus.

# Fazit
Die Untersuchung des Routing-Problems von Drohnen, welches in dieser Arbeit adressiert wurde, hat sich als komplexer erwiesen als ursprünglich vermutet. Es gibt eine Vielzahl von Standards und Regeln, die berücksichtigt werden müssen, was die Entwicklung einer einheitlichen Lösung erschwert hat. Insbesondere die verschiedenen Geo-Formate in ein einheitliches Format zu wandeln verursachte viel Kommunikationsbedarf. Die Tatsache, dass Geo-Koordinaten nicht einheitlich gespeichert werden und die Reihenfolge von Latitude und Longitude variieren, war einer der zeitintensiven Abschnitte dieser Arbeit.

Die Visualisierung war nicht Teil der Aufgabenstellung, hat aber wesentlich für das Verständnis der Aufgabe beigetragen. Die Verwendung einer Geometry-Library hätte die Arbeit erleichtert, indem es mehr Zeit für Entscheidungsfindung und Optimierungen der Anwendung geschaffen hätte. Trotz des erhöhten Aufwands war das Thema jedoch angenehm und spannend. Das Proof of Concept hat gezeigt, dass es möglich ist, eine Lösung zu finden, jedoch erfordert es weitere Optimierungen und Anpassungen, um ein optimales Ergebnis zu erzielen.