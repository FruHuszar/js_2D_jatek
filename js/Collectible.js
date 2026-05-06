export default class Collectible {
  #x;
  #y;
  #id;
  #szuloElem;
  #meret = 4;

  constructor(szuloElem, id) {
    this.#szuloElem = szuloElem;
    this.#id = `targy-${id}`;
    this.megjelenit();
    this.frissitMeret();
    this.#ujraPozicional();
  }

  megjelenit() {
    const targyKod = `
      <div id="${this.#id}" class="entity collectible" style="
        left: ${this.#x}%; 
        top: ${this.#y}%; 
        width: ${this.#meret}%; 
        background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png');
      "></div>
    `;
    this.#szuloElem.insertAdjacentHTML("beforeend", targyKod);
  }

  frissitMeret() {
    const elem = document.getElementById(this.#id);
    if (elem) {
      const cssMeret = window
        .getComputedStyle(elem)
        .getPropertyValue("--meret");
      this.#meret = parseFloat(cssMeret) || 4;
      elem.style.width = `${this.#meret}%`;
    }
  }

  #ujraPozicional() {
    const elem = document.getElementById(this.#id);
    this.#x = Math.floor(Math.random() * (100 - this.#meret));
    this.#y = Math.floor(Math.random() * (100 - this.#meret));
    if (elem) {
      elem.style.left = `${this.#x}%`;
      elem.style.top = `${this.#y}%`;
    }
  }

  getPozicio() {
    return { x: this.#x, y: this.#y, meret: this.#meret };
  }

  eltuntet() {
    const elem = document.getElementById(this.#id);
    if (elem) elem.remove();
  }
}
