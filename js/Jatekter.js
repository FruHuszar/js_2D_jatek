import Jatekos from "./Jatekos.js";
import Collectibles from "./Collectibles.js";
import Iranyitas from "./iranyitas/Iranyitas.js";

export default class Jatekter {
  #meret = { width: 100, height: 100 };
  #jatekos;
  #szuloElem;
  #targyak;
  #iranyito;
  #jatekosMeret = 13;
  #sebesseg = 0.8;

  #eletBarElem;
  #utolsoIdobelyeg = 0;

  constructor(szuloElem, pokemonData) {
    this.#szuloElem = szuloElem;
    this.init(pokemonData);
  }

  init(pokemonData) {
    this.#jatekos = new Jatekos(pokemonData, this.#szuloElem);
    this.#targyak = new Collectibles(this.#szuloElem);
    this.#iranyito = new Iranyitas();

    this.#eletBarElem = document.getElementById("elet-bar");

    this.updateInfoPanel();

    requestAnimationFrame((most) => this.gameLoop(most));
  }

  gameLoop(most) {
    const idoSzamit = most - this.#utolsoIdobelyeg;
    this.#utolsoIdobelyeg = most;

    this.frissites(idoSzamit);
    requestAnimationFrame((kovetkezo) => this.gameLoop(kovetkezo));
  }

  frissites(idoSzamit) {
    const jelenlegiHelyzet = this.#jatekos.getHelyzet();
    const ujAdatok = this.#iranyito.kovetkezoHelyzet(
      jelenlegiHelyzet,
      this.#sebesseg,
    );

    const jatekosSzelesseg = 10;
    const jatekosMagassag = 10; // Ha négyzetes, vagy mérd le pontosan

    if (ujAdatok.x < 0) ujAdatok.x = 0;
    if (ujAdatok.x > 100 - jatekosSzelesseg)
      ujAdatok.x = 100 - jatekosSzelesseg;

    if (ujAdatok.y < 0) ujAdatok.y = 0;
    if (ujAdatok.y > 100 - jatekosMagassag) ujAdatok.y = 100 - jatekosMagassag;

    this.#jatekos.setHelyzet(ujAdatok);
    this.utkozesEllenorzes();

    if (this.#jatekos.eletFogyasAktiv && this.#jatekos.elet > 0) {
      // 10 másodperc alatt fogy el teljesen: (100 egység / 10000 ms) * eltelt ms
      const csokkentes = (100 / 2000) * idoSzamit;
      this.#jatekos.veszitEletet(csokkentes);
      this.updateEletBar();
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
        this.updateEletBar();

        if (this.#targyak.darabszam === 0) {
          this.#targyak.ujratolt();
        }
      }
    }
  }

  updateEletBar() {
    if (this.#eletBarElem) {
      const szazalek = this.#jatekos.elet;
      this.#eletBarElem.style.width = `${szazalek}%`;

      this.#eletBarElem.style.background =
        szazalek < 30
          ? "linear-gradient(90deg, #ff0000, #b30000)"
          : "linear-gradient(90deg, #ff4b2b, #ff416c)";
    }
  }

  updateInfoPanel() {
    const nevElem = document.getElementById("player-name");
    const pontElem = document.getElementById("player-score");
    if (nevElem) nevElem.innerText = this.#jatekos.getNev();
    if (pontElem) pontElem.innerText = this.#jatekos.getPontszam();
  }
}
