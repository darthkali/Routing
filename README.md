# Routing

Die Routing-Anwendung ist ein spezielles Programm, das es ermöglicht, Flüge für Drohnen zu planen und auszuführen.

Die Routing-Anwendung nutzt dabei verschiedene Daten, um die Drohne bei der Navigation zu unterstützen. Dazu gehören zum Beispiel Luftverkehrsregeln, die festlegen, wo und wie Drohnen fliegen dürfen, sowie topographische Karten und Wetterinformationen, die für die Planung der Route und die Überwachung von potenziellen Hindernissen und Gefahren wichtig sind.

Insgesamt bietet eine Routing-Anwendung für Drohnen eine wichtige Unterstützung für die Steuerung und Navigation von Drohnen, sodass sie ihre Ziele sicher und effizient erreichen können. Dies kann dazu beitragen, dass Drohnen in immer mehr Bereichen eingesetzt werden, wodurch sie vielseitig und nützlich werden.

<p align="center">
    <img src="https://user-images.githubusercontent.com/46423967/208264682-b1c12fe4-db24-4f53-9adc-b21353bcc5e4.png"/>
</p>



## Aufbau
Die Anwendung ist in ein Frontend und ein Backend aufgeteilt. Das Frontend ist für die Darstellung der Karte und die Interaktion mit dem Nutzer zuständig. Das Backend ist für die Bereitstellung der Endpunkte sowie die Berechnung der Route zuständig.



<p align="center">
    <img  alt="image" src="https://user-images.githubusercontent.com/46423967/208264609-c6de520a-c01f-4e80-9010-7128e864003e.png">
</p>

### Frontend
Hier wird die Karte mit den Sperrzonen und die Route dargestellt. Außerdem kann der Nutzer mit der Maus die Start- und Endpunkte setzen und die Route berechnen lassen.
Als Programmiersprache wird `P5JS` verwendet. Als Framework für das Arbeiten mit einer interaktiven Karte wird [Mappa.JS](https://mappa.js.org/) verwendet, da dieses Framework initial für `P5JS` entwickelt wurde und somit eine gute Integration bietet.

### Backend
Im Backend wird die Route berechnet und die Daten für die Karte bereitgestellt. Hierzu wird die Programmiersprache `JavaScipt` und `NodeJS` als Server Framework verwendet.


## Installation
### Frontend
Im Frontend müssen zunächst verschiedene Dependencies installiert werden. Dies kann über den Paketmanager `npm` erfolgen. Dazu in das Verzeichnis `frontend` wechseln und folgenden Befehl ausführen:
```bash
npm install
```

### Backend
Im Backend müssen zunächst verschiedene Dependencies installiert werden. Dies kann über den Paketmanager `npm` erfolgen. Dazu in das Verzeichnis `backend` wechseln und folgenden Befehl ausführen:

```bash
npm install
```

Um Zugriff auf die AipAPI zu erhalten, muss ein API Key generiert werden. Dieser kann auf der [AipAPI](https://www.openaip.net/) Seite generiert werden. Hierzu muss man sich einen Account anlegen und dann im Profil einen Key generieren lassen. Dieser muss dann in der Datei `backend/src/.env` eingetragen werden.

Hierzu kann man entweder die vorhandene `.env.example` kopieren und dann `.example` entfernen oder eine leere `.env` anlegen und den Key in folgendem Format eintragen:
```dotenv
API_KEY=<Your-Personal_API-Key>
```



### Starten der Anwendung
Um die Anwendung zu starten, muss zunächst das Backend gestartet werden. Dazu in das Verzeichnis `backend` wechseln und folgenden Befehl ausführen:
```bash
npm .
```

Danach kann das Frontend gestartet werden. Dazu in das Verzeichnis `frontend` wechseln und die [index.html](frontend%2Findex.html) ausführen. In dem sich öffnenden Fenster dann auf den Button `Karte` klicken.


Alternativ kann die Karte auch direkt über die [map.html](frontend%2Fviews%2FMap%2Fmap.html) geöffnet werden, welche sich im Verzeichnis `frontend/views/Map` befindet.



## Dokumentation
Zu den einzelnen Komponenten der Routing-Anwendung gibt es verschiedene Dokumentationen. Diese befinden sich im Ordner `docs`. Folgende Dokumentationen sind verfügbar:

| Dokumentation                                  | Beschreibung                                                                                                                                                         |
|:-----------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Allgemein](docs%2FAllgemein.md)               | Hierin ist ganz allgemein die Idee der Routing-Anwendung beschrieben, sowie allgemeine Hinweise zu Längen- und Breitenangaben, Höhendaten und weitere Informationen. | 
| [MapVisualization](docs%2FMapVisualization.md) | In diesem Abschnitt finden sich Hinweise zur Visualisierung der Karte mit den Sperrzonen und zur Installation und Nutzung des Frameworks `Mappa.JS`.                 |
| [GeoJson](docs%2FGeoJson.md)                   | Hierin befinden sich Informationen zum GeoJson Format, sowie eine Beschreibung der verwendeten GeoJson Dateien.                                                      |
| [RayCastAlgorithm](docs%2FRayCastAlgorithm.md) | In diesem Abschnitt wird der RayCast Algorithmus beschrieben. Dieser kann errechnen, ob ein Punkt innerhalb eines Polygons liegt.                                    |     




