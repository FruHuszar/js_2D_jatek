export default class Jatekos {
  #elet; // továbbfejlesztéshez
  #pontszam;
  #helyzet = { x: 0, y: 0 };
  #hatizsak = []; // még nincs kihasználva
  #frontImg; 
  #backImg;  
  #nev;
  #elem;

  constructor(data, szuloElem) {
    this.#nev = data.name;
    this.#frontImg = data.sprites.front_default;
    this.#backImg = data.sprites.back_default; 
    
    this.#pontszam = 0;
    this.#elet = 3;
    this.szuloElem = szuloElem;
    
    this.megjelenit();
  }

  megjelenit() {
    const imgKod = `<img id="jatekos" class="entity" src="${this.#frontImg}" alt="${this.#nev}">`;
    this.szuloElem.insertAdjacentHTML("beforeend", imgKod);
    this.#elem = document.getElementById("jatekos");
    
    this.setHelyzet({ x: 45, y: 45, dx: 0, dy: 1 });
  }

  /**
   * @param {Object} adatok - {x, y, dx, dy} 
   * dx és dy az elmozdulás iránya (-1, 0, 1)
   */
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

    if (dy < 0) {
      this.#elem.src = this.#backImg;
    } else if (dy > 0 || dx !== 0) {
      this.#elem.src = this.#frontImg;
    }

    const isBackView = this.#elem.src === this.#backImg;

    if (dx < 0) {
      isBackView 
        ? this.#elem.classList.add("mirror") 
        : this.#elem.classList.remove("mirror");
    } 
    else if (dx > 0) {
      isBackView 
        ? this.#elem.classList.remove("mirror") 
        : this.#elem.classList.add("mirror");
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

  targyFelvesz() {
    this.#pontszam++;
  }
}