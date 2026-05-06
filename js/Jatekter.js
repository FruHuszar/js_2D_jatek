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
  #sebesseg = 0.8;

  // Új privát változók az élethez
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

    // DOM elem lekérése
    this.#eletBarElem = document.getElementById("elet-bar");

    this.updateInfoPanel();

    // Az első hívásnál elindítjuk a ciklust
    requestAnimationFrame((most) => this.gameLoop(most));
  }

  gameLoop(most) {
    // Delta time kiszámítása (ms)
    const dt = most - this.#utolsoIdobelyeg;
    this.#utolsoIdobelyeg = most;

    this.frissites(dt);
    requestAnimationFrame((kovetkezo) => this.gameLoop(kovetkezo));
  }

  frissites(dt) {
    // 1. Irányítás és mozgás
    const ujAdatok = this.#iranyito.kovetkezoHelyzet(
      this.#jatekos.getHelyzet(),
      this.#sebesseg
    );

    if (ujAdatok.dx !== 0 || ujAdatok.dy !== 0) {
      this.#jatekos.setHelyzet(ujAdatok);
      this.utkozesEllenorzes();
    }

    // 2. Élet csökkentése idő alapon (ha már elindult a fogyás)
    if (this.#jatekos.eletFogyasAktiv && this.#jatekos.elet > 0) {
      // 10 másodperc alatt fogy el teljesen: (100 egység / 10000 ms) * eltelt ms
      const csokkentes = (100 / 2000) * dt;
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
        // A targyFelvesz() metódust a Jatekos.js-ben úgy módosítottuk,
        // hogy pontot ad, aktiválja a fogyást és gyógyít.
        this.#jatekos.targyFelvesz();

        this.#targyak.tavolit(i);
        this.updateInfoPanel();
        this.updateEletBar(); // Azonnali frissítés felvételkor

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

      // Szín váltás ha kevés az élet
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
