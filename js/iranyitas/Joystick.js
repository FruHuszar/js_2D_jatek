// js/iranyitas/Joystick.js

export default class Joystick {
  #base;
  #stick;
  #aktiv = false;
  #vektor = { dx: 0, dy: 0 };
  #sugar = 0;
  #kozepont = { x: 0, y: 0 };
  #boost = 1.9;

  constructor() {
    this.#base = document.getElementById("joystick-base");
    this.#stick = document.getElementById("joystick-stick");

    if (this.#base && this.#stick) {
      this.#esemenyfigyelok();
    }
  }

  /**
   * Eseményfigyelők beállítása Pointer eseményekkel (Egér + Touch + Toll)
   */
  #esemenyfigyelok() {
    this.#base.addEventListener("pointerdown", (e) => {
      this.#aktiv = true;

      // Hozzáláncoljuk az eseményt az elemhez, hogy ha az ujj lecsúszik,
      // akkor is kövesse a mozgást a pointerup-ig.
      this.#base.setPointerCapture(e.pointerId);

      // Frissítjük a méreteket (fontos, ha közben elfordították a telefont)
      const rect = this.#base.getBoundingClientRect();
      this.#sugar = rect.width / 2;
      this.#kozepont.x = rect.left + this.#sugar;
      this.#kozepont.y = rect.top + this.#sugar;

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

    // Ha váratlanul megszakad a kapcsolat (pl. bejövő hívás)
    this.#base.addEventListener("pointercancel", () => {
      this.#leallit();
    });
  }

  /**
   * Kiszámolja a vektorokat és mozgatja a vizuális kart
   */
  #frissit(e) {
    // 1. Relatív távolság az ujj/egér és a joystick közepe között
    let diffX = e.clientX - this.#kozepont.x;
    let diffY = e.clientY - this.#kozepont.y;

    // 2. Távolság (Pitagorasz)
    const tavolsag = Math.sqrt(diffX * diffX + diffY * diffY);

    // 3. Normalizált kitérés (0.0 - 1.0 között)
    // Ez biztosítja, hogy a számítás független a pixelek számától.
    let kiteres = Math.min(tavolsag / this.#sugar, 1);

    // 4. Irány meghatározása (egységvektor)
    const iranyX = tavolsag > 0 ? diffX / tavolsag : 0;
    const iranyY = tavolsag > 0 ? diffY / tavolsag : 0;

    // 5. Vizuális visszacsatolás (Stick mozgatása a határokon belül)
    const vizuX = iranyX * kiteres * this.#sugar;
    const vizuY = iranyY * kiteres * this.#sugar;
    this.#stick.style.transform = `translate(${vizuX}px, ${vizuY}px)`;

    // 6. Kimeneti vektor kiszámítása boost-tal
    // A dx/dy értéke így 0 és 1.25 (vagy boost értéke) közé esik.
    this.#vektor.dx = iranyX * kiteres * this.#boost;
    this.#vektor.dy = iranyY * kiteres * this.#boost;
  }

  #leallit() {
    this.#aktiv = false;
    this.#vektor = { dx: 0, dy: 0 };
    if (this.#stick) {
      this.#stick.style.transform = `translate(0px, 0px)`;
    }
  }

  mutat() {
    this.#base?.classList.remove("hidden");
  }

  elrejt() {
    this.#base?.classList.add("hidden");
    this.#leallit();
  }

  /**
   * Visszaadja a jelenlegi irányvektort
   * @returns {Object} {dx, dy}
   */
  getVektor() {
    return { ...this.#vektor };
  }
}
