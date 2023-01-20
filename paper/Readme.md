## Installation
- Es muss `perl` installiert sein.
- **Windows:**
  - `MikTeX` installieren: https://miktex.org/download
  - `latexmk` in der MikTeX-Console als Paket installieren

- **Mac:**
  - Mactex installieren: https://www.tug.org/mactex/mactex-download.html
  - `latexmk` in der TeX-Live-Utility  als Paket installieren
  - `latexmk` zur `$PATH` hinzufügen: `/Library/TeX/texbin`
    - `sudo nano /etc/paths`

## Aufbau der Arbeit
Der strukturelle Aufbau kann in der `thesis.tex` vollzogen werden. Hier können dann auch alle neuen Kapitel eingefügt werden.

## Build-Files
Es gibt 2 Build-Files im Ordner `system`
In den BuildFiles kann man einen Debug-Mode anschalten. Der verhindert, dass sich das Terminal nach fertigstellung des Scripts automatisch schließt.

Ggf muss man den Pfad zu `makeglossaries.exe` anpassen

## Literatureinträge
Bib-Files können im Ordner `bib` als `literatur.bib`gespeichert werden

## Listings
Die neu erstellten Listing-Konfigurationen müssen in der `misc/listings/_imports` eingetragen werden.
Dazu einfach eine neue Zeile mit folgender syntax erstellen:

`\input{misc/listings/<NAME_DER_NEUEN_DATEI>}`

## Glossar Einträge
Alle Glossar Einträge können in der Datei `misc/glossaryEntries.tex` eingefügt werden

## Meta-Informationen
Alle wiederkehrenden Informationen können in der Datei `misc/metainformation.tex` eingefügt werden

## Besondere Worttrennungen
Besondere Worttrennungen, die Latex selber nicht gut umbricht, können in der Datei `misc/worttrennung.tex` eingefügt werden

