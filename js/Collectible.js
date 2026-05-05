export default class Collectible {
  #pozicio = { x: 0, y: 0 };
  #id;
  #elem;
  #meret = 5; /* százalékban */

  constructor(szuloElem, id) {
    this.szuloElem = szuloElem;
    this.#id = id;

    this.#generalPozicio();
    this.megjelenit();
  }

  #generalPozicio() {
    this.#pozicio.x = Math.floor(Math.random() * (100 - this.#meret));
    this.#pozicio.y = Math.floor(Math.random() * (100 - this.#meret));
  }

  megjelenit() {
    const targyKod = `
      <div 
        id="collectible-${this.#id}" 
        class="entity collectible" 
        style="
          left: ${this.#pozicio.x}%; 
          top: ${this.#pozicio.y}%; 
          width: ${this.#meret}%; 
          height: ${this.#meret}%;
          background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png');
        ">
      </div>`;

    this.szuloElem.insertAdjacentHTML("beforeend", targyKod);
    this.#elem = document.getElementById(`collectible-${this.#id}`);
  }

  eltuntet() {
    if (this.#elem) {
      this.#elem.remove();
    }
  }

  getPozicio() {
    return {
      x: this.#pozicio.x,
      y: this.#pozicio.y,
      meret: this.#meret,
    };
  }

  getId() {
    return this.#id;
  }
}
