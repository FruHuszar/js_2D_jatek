import Collectible from "./Collectible.js";

export default class Collectibles {
  #lista = [];
  #szuloElem;

  constructor(szuloElem) {
    this.#szuloElem = szuloElem;
    this.ujratolt();
  }

  ujratolt() {
    const mennyiseg = Math.floor(Math.random() * (6 - 2 + 1)) + 2;

    for (let i = 0; i < mennyiseg; i++) {
      const egyediId = Date.now() + Math.floor(Math.random() * 1000) + i;
      
      const ujTargy = new Collectible(this.#szuloElem, egyediId);
      this.#lista.push(ujTargy);
    }
    console.log(`Raktár frissítve: ${mennyiseg} új tárgy.`);
  }

  get lista() {
    return this.#lista;
  }

  get darabszam() {
    return this.#lista.length;
  }

  /**
   * Kivesz egy tárgyat a listából és eltünteti a vizuális felületről
   * @param {number} index - A törlendő tárgy helye a listában
   */
  tavolit(index) {
    if (index > -1 && index < this.#lista.length) {
      this.#lista[index].eltuntet();
      this.#lista.splice(index, 1);
    }
  }
}