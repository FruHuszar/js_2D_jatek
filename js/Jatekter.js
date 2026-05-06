import Jatekos from "./Jatekos.js";
import Collectibles from "./Collectibles.js";
import Iranyitas from "./iranyitas/Iranyitas.js";

export default class Jatekter {
  #meret = { width: 100, height: 100 };
  #jatekos;
  #szuloElem;
  #targyak;
  #iranyito;
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
    // Delta time kiszámítása (ms)
    const idoSzamit = most - this.#utolsoIdobelyeg;
    this.#utolsoIdobelyeg = most;

    this.frissites(idoSzamit);
    requestAnimationFrame((kovetkezo) => this.gameLoop(kovetkezo));
  }

  frissites(idoSzamit) {
    // 1. Irányítás és mozgás (az Iranyitas.js most már korlátozás nélküli koordinátákat ad)
    const javasoltAdatok = this.#iranyito.kovetkezoHelyzet(
      this.#jatekos.getHelyzet(),
      this.#sebesseg,
    );

    // 2. Határellenőrzés alkalmazása a javasolt koordinátákra
    const veglegesAdatok = this.#hatarEllenorzes(javasoltAdatok);

    // Csak akkor frissítünk, ha mozgás történik
    if (javasoltAdatok.dx !== 0 || javasoltAdatok.dy !== 0) {
      this.#jatekos.setHelyzet(veglegesAdatok);
      this.utkozesEllenorzes();
    }

    if (this.#jatekos.eletFogyasAktiv && this.#jatekos.elet > 0) {
      // 10 másodperc alatt fogy el teljesen: (100 egység / 2000 ms) * eltelt ms
      const csokkentes = (100 / 2000) * idoSzamit;
      this.#jatekos.veszitEletet(csokkentes);
      this.updateEletBar();
    }
  }

  #hatarEllenorzes(adatok) {
    const meret = this.#jatekos.getMeret(); // Most már {w, h} objektumot kapunk
    const korrigaltAdatok = { ...adatok };

    korrigaltAdatok.x = Math.max(0, Math.min(100 - meret.w, adatok.x));
    korrigaltAdatok.y = Math.max(0, Math.min(100 - meret.h, adatok.y));

    return korrigaltAdatok;
  }

  utkozesEllenorzes() {
    const jatekosPos = this.#jatekos.getHelyzet();
    const jatekosMeret = this.#jatekos.getMeret(); // {w, h}
    const jelenlegiTargyak = this.#targyak.lista;

    for (let i = jelenlegiTargyak.length - 1; i >= 0; i--) {
      const targy = jelenlegiTargyak[i];
      const targyPos = targy.getPozicio(); // {x, y, meret}

      // Ütközés ellenőrzése a szélesség (.w) és magasság (.h) használatával
      if (
        jatekosPos.x < targyPos.x + targyPos.meret &&
        jatekosPos.x + jatekosMeret.w > targyPos.x &&
        jatekosPos.y < targyPos.y + targyPos.meret &&
        jatekosPos.y + jatekosMeret.h > targyPos.y
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
