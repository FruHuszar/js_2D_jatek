import Jatekos from "./Jatekos.js";
import Collectible from "./Collectible.js";

export default class Jatekter {
  #meret = { width: 100, height: 100 };
  #jatekos;
  #szuloElem;
  #targyak = [];
  #lepesKoz = 2;
  #jatekosMeret = 10; // összekötni a css-el: .entity width és height
  #targySzam = 5;

  constructor(szuloElem, pokemonData) {
    this.#szuloElem = szuloElem;
    this.init(pokemonData);
  }

  init(pokemonData) {
    this.#jatekos = new Jatekos(pokemonData, this.#szuloElem);

    for (let i = 0; i < this.#targySzam; i++) {
      this.#targyak.push(new Collectible(this.#szuloElem, i));
    }

    this.billentyuzetFigyelo();
    this.updateInfoPanel();
  }

  billentyuzetFigyelo() {
    window.addEventListener("keydown", (e) => {
      let { x, y } = this.#jatekos.getHelyzet();

      switch (e.key) {
        case "ArrowUp":
          y -= this.#lepesKoz;
          break;
        case "ArrowDown":
          y += this.#lepesKoz;
          break;
        case "ArrowLeft":
          x -= this.#lepesKoz;
          break;
        case "ArrowRight":
          x += this.#lepesKoz;
          break;
        default:
          return;
      }

      this.jatekosMozgatas(x, y);
    });
  }

  /**
   * Mozgatja a játékost, de csak ha a pályán belül maradna
   */
  jatekosMozgatas(ujX, ujY) {
    if (ujX < 0) ujX = 0;
    if (ujX > this.#meret.width - this.#jatekosMeret) {
      ujX = this.#meret.width - this.#jatekosMeret;
    }

    if (ujY < 0) ujY = 0;
    if (ujY > this.#meret.height - this.#jatekosMeret) {
      ujY = this.#meret.height - this.#jatekosMeret;
    }

    this.#jatekos.setHelyzet({ x: ujX, y: ujY });

    this.utkozesEllenorzes();
  }

  utkozesEllenorzes() {
    const jatekosPos = this.#jatekos.getHelyzet();

    for (let i = this.#targyak.length - 1; i >= 0; i--) {
      const targy = this.#targyak[i];
      const targyPos = targy.getPozicio();

      if (
        jatekosPos.x < targyPos.x + targyPos.meret &&
        jatekosPos.x + this.#jatekosMeret > targyPos.x &&
        jatekosPos.y < targyPos.y + targyPos.meret &&
        jatekosPos.y + this.#jatekosMeret > targyPos.y
      ) {
        // Ütközés történt!
        this.#jatekos.targyFelvesz(); // Pontszám növelése
        targy.eltuntet(); // Törlés a DOM-ból
        this.#targyak.splice(i, 1); // Törlés a logikai listából
        this.updateInfoPanel(); // UI frissítés
      }
    }
  }

  updateInfoPanel() {
    const nevElem = document.getElementById("player-name");
    const pontElem = document.getElementById("player-score");

    if (nevElem) nevElem.innerText = this.#jatekos.getNev();
    if (pontElem) pontElem.innerText = this.#jatekos.getPontszam();
  }
}
