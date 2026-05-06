# Javascript 2D Játék

## Specifikáció

Egy JavaScript alapú, rácsos vagy pixel alapú mozgást használó 2D játék elkészítése, amely demonstrálja az osztályok közötti kommunikációt, az eseménykezelést (billentyűzet) és a dinamikus DOM-manipulációt

## Mappa struktúra

```css
/*
Kezdeti mappaszerkezet: 
project/
│
├── index.html
├── style.css
└── js/
    ├── index.js
    ├── Jatekter.js
    ├── Jatekos.js
    ├── Collectible.js
    └── Service.js


Végső mappaszerkezet:  
project/
│
├── index.html
└── css/
    ├── style.css
    ├── header.css
    ├── entitas.css
    └── joystick.css
└── js/
    └── iranyitas/
        ├── Iranyitas.js
        ├── Billentyuzet.js
        └── Joystick.js
    ├── index.js
    ├── Jatekter.js
    ├── Jatekos.js
    ├── Collectible.js
    └── Service.js   
*/
```

## Funkcionális követelmények

### Játéktér és Vizualitás

- Pálya: Egy meghatározott méretű terület (szülőelem), amely rendelkezik látható határvonallal (border).
- Ütközéskezelés: A játékos nem hagyhatja el a játéktér területét; a széleknél a mozgásnak meg kell állnia.
- Panel: A játéktéren kívül vagy felett megjelenik a játékos neve és az aktuálisan gyűjtött pontszáma.

### Irányítás és Interakció

- Mozgás: A játékos a billentyűzet nyíl gombjaival (Fel, Le, Balra, Jobbra) irányítható.
- Gyűjtögetés: A pályán véletlenszerű pontokon Collectible (tárgy) objektumok jelennek meg.
- Pontszerzés: Ha a játékos pozíciója megegyezik egy tárgy pozíciójával, a tárgy eltűnik, a játékos pontszáma pedig növekszik.

## Megvalósítás

- Háttér relativ pozíció, játékelemek (collectible és játékos) absolute. top és left értékek változtatásával lehet mozogni. A reszponzivitás miatt ez (minden érték) százelékos (1 és 100 közt).

### Prompt és beszélgetés

1. Specifikáció átfogalmazása vázlat alapján
2. Lépések megbeszélése
3. Kód generálás lépésenként/fájlonként
4. Továbbfejlesztések kérése
5. cleanup, javítások, ai nélkül

link: https://gemini.google.com/share/7e5ba97fbd4b

### Továbbfejlesztések

- ❌ Pálya méretezése, dinamikus háttér
- ✔ Billentyűkezelés: oldalsó + felső/alsó egyszerre lenyomása, nem darabos mozgás -> új rendszer: gameloop() és keydown keys tömbre.
- ✔+ Joystick hozzáadva, választható minden eszközön.
- ❌ Választható karakter
- ✔ Health system: amíg nem ér a collektibleshez csökken
- ✔+ Nehézség választása (health csökkenés sebessége) / szint system: egyre gyorsabb, egyre többet kell gyűjteni
- ❌ Játék státusz ellenőrzés: Nyertél/Vesztettél

### Metódusok, kódok

- Joystick kattintás és mozgatás során a cursor visszaáll default-ra, ezért:

```css
body:has(#joystick-stick:active) {
  cursor: pointer;
}
```
