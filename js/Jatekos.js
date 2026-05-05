export default class Jatekos {
  #elet;
  #pontszam;
  #helyzet = { x: 0, y: 0 };
  #hatizsak = [];
  #kep;
  #nev;
  #elem; // A DOM elem referenciája

  constructor(data, szuloElem) {
    this.#nev = data.name;
    this.#kep = data.sprites.front_default;
    this.#pontszam = 0;
    this.#elet = 3;
    this.szuloElem = szuloElem;

    this.megjelenit();
  }

  megjelenit() {
    const imgKod = `<img id="jatekos" class="entity" src="${this.#kep}" alt="${this.#nev}">`;
    this.szuloElem.insertAdjacentHTML("beforeend", imgKod);

    this.#elem = document.getElementById("jatekos");

    this.setHelyzet({ x: 45, y: 45 });
  }

  /**
   * @param {Object} pozicio - {x, y} százalékos értékek (0-100)
   */
  setHelyzet({ x, y }) {
    this.#helyzet.x = x;
    this.#helyzet.y = y;

    if (this.#elem) {
      this.#elem.style.left = `${this.#helyzet.x}%`;
      this.#elem.style.top = `${this.#helyzet.y}%`;
    }
  }

  getHelyzet() {
    return { ...this.#helyzet };
  }

  getNev() {
    return this.#nev.charAt(0).toUpperCase() + this.#nev.slice(1);
  }

  getPontszam() {
    return this.#pontszam;
  }

  targyFelvesz(ertek = 1) {
    this.#pontszam += ertek;
  }
}
