import Service from "./Service.js";
import Jatekter from "./Jatekter.js";

const POKEMON_ID = 25; 
const VEGPONT = `https://pokeapi.co/api/v2/pokemon/${POKEMON_ID}`;
const SZULOELEM = document.getElementById("jatekter");

const szerviz = new Service();

szerviz.getData(VEGPONT, (adat) => {
    if (adat) {
        new Jatekter(SZULOELEM, adat);
        
        console.log("Játék sikeresen elindítva!");
    } else {
        console.error("Nem sikerült betölteni a Pokemon adatokat.");
        document.getElementById("player-name").innerText = "Hiba a betöltésnél";
    }
});