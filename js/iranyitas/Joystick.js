export default class Joystick {
  #base;
  #stick;
  #aktiv = false;
  #vektor = { dx: 0, dy: 0 };
  #sugar = 50; // A külső kör sugara (pixelben)
  #kozepont = { x: 0, y: 0 };

  constructor() {
    this.#base = document.getElementById("joystick-base");
    this.#stick = document.getElementById("joystick-stick");

    if (this.#base && this.#stick) {
      this.#esemenyfigyelok();
    }
  }

  #esemenyfigyelok() {
    // A 'pointerdown' kezeli az egeret és az érintést is
    this.#base.addEventListener("pointerdown", (e) => {
      this.#aktiv = true;

      // Elfogjuk a pointert, hogy akkor is kövesse, ha kimegyünk a körből
      this.#base.setPointerCapture(e.pointerId);

      const rect = this.#base.getBoundingClientRect();
      this.#kozepont.x = rect.left + rect.width / 2;
      this.#kozepont.y = rect.top + rect.height / 2;

      this.#frissit(e);
    });

    this.#base.addEventListener("pointermove", (e) => {
      if (!this.#aktiv) return;
      this.#frissit(e);
    });

    this.#base.addEventListener("pointerup", (e) => {
      this.#base.releasePointerCapture(e.pointerId);
      this.#leallit();
    });
  }

  #frissit(e) {
    let elmozdulasX = e.clientX - this.#kozepont.x;
    let elmozdulasY = e.clientY - this.#kozepont.y;

    const tavolsag = Math.sqrt(
      elmozdulasX * elmozdulasX + elmozdulasY * elmozdulasY
    );

    if (tavolsag > this.#sugar) {
      const arany = this.#sugar / tavolsag;
      elmozdulasX *= arany;
      elmozdulasY *= arany;
    }

    this.#stick.style.transform = `translate(${elmozdulasX}px, ${elmozdulasY}px)`;
    this.#vektor.dx = elmozdulasX / this.#sugar;
    this.#vektor.dy = elmozdulasY / this.#sugar;
  }

  #leallit() {
    this.#aktiv = false;
    this.#vektor = { dx: 0, dy: 0 };
    // Visszaugrik középre
    this.#stick.style.transform = `translate(0px, 0px)`;
  }

  /**
   * Megjeleníti a joystick vizuális elemeit
   */
  mutat() {
    this.#base?.classList.remove("hidden");
  }

  elrejt() {
    this.#base?.classList.add("hidden");
    this.#leallit();
  }

  /**
   * Az Iranyitas osztály ezen keresztül kéri le a joystick állapotát
   * @returns {Object} {dx, dy}
   */
  getVektor() {
    return { ...this.#vektor };
  }
}
