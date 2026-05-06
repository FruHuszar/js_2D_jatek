export default class Billentyuzet {
  #keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  constructor() {
    this.#esemenyfigyelok();
  }

  #esemenyfigyelok() {
    window.addEventListener("keydown", (e) => {
      if (this.#keys.hasOwnProperty(e.key)) {
        this.#keys[e.key] = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.#keys.hasOwnProperty(e.key)) {
        this.#keys[e.key] = false;
      }
    });
  }

  /**
   * Visszaadja a gombok állapota alapján az irányvektort
   * @returns {Object} {dx, dy}
   */
  getVektor() {
    let dx = 0;
    let dy = 0;

    if (this.#keys.ArrowUp) dy = -1;
    else if (this.#keys.ArrowDown) dy = 1;

    if (this.#keys.ArrowLeft) dx = -1;
    else if (this.#keys.ArrowRight) dx = 1;

    return { dx, dy };
  }
}
