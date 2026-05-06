export default class Jatekos {
  #helyzet = { x: 0, y: 0 };
  #frontImg;
  #backImg;
  #nev;
  #elem;

  pontszam = 0;
  elet = 100;
  eletFogyasAktiv = false;

  constructor(data, szuloElem) {
    this.#nev = data.name;
    this.#frontImg = data.sprites.front_default;
    this.#backImg = data.sprites.back_default;
    this.szuloElem = szuloElem;

    this.megjelenit();
  }

  targyFelvesz() {
    this.pontszam++;
    this.gyogyul();

    if (this.pontszam === 1) {
      this.eletInditasa();
    }
  }

  veszitEletet(mennyiseg) {
    if (!this.eletFogyasAktiv) return;
    this.elet -= mennyiseg;
    if (this.elet < 0) this.elet = 0;
  }

  gyogyul() {
    this.elet = 100;
  }

  eletInditasa() {
    this.eletFogyasAktiv = true;
  }

  megjelenit() {
    const imgKod = `<img id="jatekos" class="entity" src="${
      this.#frontImg
    }" alt="${this.#nev}">`;
    this.szuloElem.insertAdjacentHTML("beforeend", imgKod);
    this.#elem = document.getElementById("jatekos");
    this.setHelyzet({ x: 45, y: 45, dx: 0, dy: 1 });
  }

  setHelyzet({ x, y, dx, dy }) {
    this.#helyzet.x = x;
    this.#helyzet.y = y;
    this.#frissitIranyt(dx, dy);

    if (this.#elem) {
      this.#elem.style.left = `${this.#helyzet.x}%`;
      this.#elem.style.top = `${this.#helyzet.y}%`;
    }
  }

  #frissitIranyt(dx, dy) {
    if (!this.#elem) return;
    if (dy < 0) this.#elem.src = this.#backImg;
    else if (dy > 0 || dx !== 0) this.#elem.src = this.#frontImg;

    const isBackView = this.#elem.src === this.#backImg;
    if (dx < 0) {
      isBackView
        ? this.#elem.classList.add("mirror")
        : this.#elem.classList.remove("mirror");
    } else if (dx > 0) {
      isBackView
        ? this.#elem.classList.remove("mirror")
        : this.#elem.classList.add("mirror");
    }
  }

  getMeret() {
    if (!this.#elem || !this.szuloElem) return { w: 10, h: 10 };

    const elemRect = this.#elem.getBoundingClientRect();
    const szuloRect = this.szuloElem.getBoundingClientRect();

    return {
      w: (elemRect.width / szuloRect.width) * 100,
      h: (elemRect.height / szuloRect.height) * 100,
    };
  }

  getHelyzet() {
    return { ...this.#helyzet };
  }

  getNev() {
    return this.#nev.charAt(0).toUpperCase() + this.#nev.slice(1);
  }

  getPontszam() {
    return this.pontszam;
  }
}
