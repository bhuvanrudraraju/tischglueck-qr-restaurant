# Tischglück — QR-Restaurantbestellung

Eine deutschsprachige, demo-fertige QR-Bestelloberfläche für ein Restaurant. Gäste öffnen einen tischgebundenen Link, bestellen aus der digitalen Speisekarte und erhalten eine druckbare Rechnung.

## Starten

Voraussetzung: Node.js 18 oder neuer.

```bash
npm install
npm run dev
```

Danach die angezeigte lokale Adresse im Browser öffnen. Für einen Produktions-Build:

```bash
npm run build
```

## QR- und Tischfluss

- Jede URL trägt einen Tisch als Parameter, z. B. `http://localhost:5173/?tisch=7`.
- Oben rechts öffnet sich der QR-Generator. Er erzeugt einen echten QR-Code für den aktuell gewählten Tisch.
- Wählen Sie dort Tisch 1–20, um Demo-Codes für weitere Tische zu generieren.
- Bestellungen und der zuletzt erzeugte Beleg werden browserlokal gespeichert, damit der Ablauf bei einem Reload sichtbar bleibt.

## Mitarbeiteransicht

Öffnen Sie nach dem Starten der App die Mitarbeiterübersicht unter:

```text
http://localhost:5173/?admin=1
```

Sie zeigt jede eingehende Demo-Bestellung mit Tischnummer, Bestellnummer, Gerichten, Küchenhinweis, Gesamtbetrag und Status. Mitarbeitende können den Status zwischen **Neu**, **In Zubereitung**, **Serviert** und **Bezahlt** ändern.

> In dieser lokalen Demo werden Bestellungen im Browser gespeichert. Die Kunden- und Mitarbeiteransicht müssen daher im selben Browserprofil laufen. Für den Livebetrieb braucht die App ein gemeinsames Backend, damit alle Geräte dieselben Bestellungen sehen.

## Enthaltene Demo-Funktionen

- Deutsche Kategorien, Gerichte, Beschreibungen und Europreise
- Warenkorb mit Mengensteuerung und Küchenhinweis
- Bestellprüfung mit Tisch und Wartezeit
- Bestellbestätigung mit Bestellnummer
- Deutsche Rechnung mit MwSt.-Ausweis und Drucken/Als-PDF-sichern
- Responsive Gestaltung für Smartphone und Desktop

## Hinweis für eine echte Produktion

Diese Version ist bewusst ohne Server gebaut und nutzt LocalStorage. Für einen Livebetrieb sollten Speisekarte, Tische und Bestellungen über ein Backend (z. B. SQLite/Postgres + API) verwaltet und Zahlungen über einen zertifizierten Zahlungsanbieter abgewickelt werden.
