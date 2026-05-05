import Service from "./Service.js";
import Jatekter from "./Jatekter.js";

const SZULOELEM = document.getElementById("jatekter");
const VEGPONT = "https://pokeapi.co/api/v2/pokemon/25";

const szerviz = new Service();

szerviz.getData(VEGPONT, (adatok) => {
  new Jatekter(SZULOELEM, adatok);
  console.log("A játék sikeresen elindult:", adatok.name);
});
