import Jatekos from "./Jatekos.js";
import Collectibles from "./Collectibles.js";
import Iranyitas from "./iranyitas/Iranyitas.js";

export default class Jatekter {
  #meret = { width: 100, height: 100 };
  #jatekos;
  #szuloElem;
  #targyak;
  #iranyito;
  #jatekosMeret = 10;

  #sebesseg = 0.8; // Sebesség százalékban (mivel másodpercenként 60x fut le)

  constructor(szuloElem, pokemonData) {
    this.#szuloElem = szuloElem;
    this.init(pokemonData);
  }

  init(pokemonData) {
    this.#jatekos = new Jatekos(pokemonData, this.#szuloElem);
    this.#targyak = new Collectibles(this.#szuloElem);
    this.#iranyito = new Iranyitas();

    this.updateInfoPanel();

    this.gameLoop();
  }

  /**
   * Folyamatosan futó ciklus (requestAnimationFrame = ~60 FPS)
   */
  gameLoop() {
    this.frissites();
    requestAnimationFrame(() => this.gameLoop());
  }

  frissites() {
    const ujAdatok = this.#iranyito.kovetkezoHelyzet(
      this.#jatekos.getHelyzet(),
      this.#sebesseg
    );

    if (ujAdatok.dx !== 0 || ujAdatok.dy !== 0) {
      this.#jatekos.setHelyzet(ujAdatok);
      this.utkozesEllenorzes();
    }
  }

  utkozesEllenorzes() {
    const jatekosPos = this.#jatekos.getHelyzet();
    const jelenlegiTargyak = this.#targyak.lista;

    for (let i = jelenlegiTargyak.length - 1; i >= 0; i--) {
      const targy = jelenlegiTargyak[i];
      const targyPos = targy.getPozicio();

      if (
        jatekosPos.x < targyPos.x + targyPos.meret &&
        jatekosPos.x + this.#jatekosMeret > targyPos.x &&
        jatekosPos.y < targyPos.y + targyPos.meret &&
        jatekosPos.y + this.#jatekosMeret > targyPos.y
      ) {
        this.#jatekos.targyFelvesz();

        this.#targyak.tavolit(i);

        this.updateInfoPanel();

        if (this.#targyak.darabszam === 0) {
          this.#targyak.ujratolt();
        }
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
