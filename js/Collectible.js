export default class Collectible {
  #x;
  #y;
  #id;
  #szuloElem;
  #meret = 5;

  constructor(szuloElem, id) {
    this.#szuloElem = szuloElem;
    this.#id = `targy-${id}`;
    this.#x = Math.floor(Math.random() * (100 - this.#meret));
    this.#y = Math.floor(Math.random() * (100 - this.#meret));
    
    this.megjelenit();
  }

  megjelenit() {
    const targyKod = `
      <div id="${this.#id}" class="entity collectible" style="
        left: ${this.#x}%; 
        top: ${this.#y}%; 
        width: ${this.#meret}%; 
        height: ${this.#meret}%;
        background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png');
      "></div>
    `;
    this.#szuloElem.insertAdjacentHTML("beforeend", targyKod);
  }

  getPozicio() {
    return { x: this.#x, y: this.#y, meret: this.#meret };
  }

  eltuntet() {
    const elem = document.getElementById(this.#id);
    if (elem) elem.remove();
  }
}