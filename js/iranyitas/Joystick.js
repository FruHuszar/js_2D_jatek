export default class Joystick {
  #base;
  #stick;
  #aktiv = false;
  #vektor = { dx: 0, dy: 0 };
  #sugar = 0; // Dinamikusan számoljuk
  #kozepont = { x: 0, y: 0 };
  #boost = 1.2; // Szorzó, hogy a joystick dinamikusabb legyen

  constructor() {
    this.#base = document.getElementById("joystick-base");
    this.#stick = document.getElementById("joystick-stick");

    if (this.#base && this.#stick) {
      this.#esemenyfigyelok();
    }
  }

  #esemenyfigyelok() {
    this.#base.addEventListener("pointerdown", (e) => {
      this.#aktiv = true;
      this.#base.setPointerCapture(e.pointerId);

      // Méretek lekérése az aktuális állapot szerint (Reszponzivitás!)
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
  }

  #frissit(e) {
    // Relatív elmozdulás kiszámítása
    let elmozdulasX = e.clientX - this.#kozepont.x;
    let elmozdulasY = e.clientY - this.#kozepont.y;

    const tavolsag = Math.sqrt(
      elmozdulasX * elmozdulasX + elmozdulasY * elmozdulasY
    );

    // Százalékos kitérés (0.0 és 1.0 között)
    // Ha a sugár 50px és 50px-re húzzuk, a kiteres = 1
    let kiteres = Math.min(tavolsag / this.#sugar, 1);

    // Irányvektor meghatározása (normalizálva)
    // Ha nincs elmozdulás, ne osszunk nullával
    const iranyX = tavolsag > 0 ? elmozdulasX / tavolsag : 0;
    const iranyY = tavolsag > 0 ? elmozdulasY / tavolsag : 0;

    // Vizuális megjelenítés (marad pixelben a transformhoz)
    const vizualisX = iranyX * kiteres * this.#sugar;
    const vizualisY = iranyY * kiteres * this.#sugar;
    this.#stick.style.transform = `translate(${vizualisX}px, ${vizualisY}px)`;

    // A Játékosnak szánt vektor: kitérés * boost
    // Itt a matek már független a pixelektől!
    this.#vektor.dx = iranyX * kiteres * this.#boost;
    this.#vektor.dy = iranyY * kiteres * this.#boost;

    // Határoljuk le, hogy a boost-tal se menjünk 1.5 fölé (vagy ahol kényelmes)
    this.#vektor.dx = Math.max(-1.5, Math.min(1.5, this.#vektor.dx));
    this.#vektor.dy = Math.max(-1.5, Math.min(1.5, this.#vektor.dy));
  }

  #leallit() {
    this.#aktiv = false;
    this.#vektor = { dx: 0, dy: 0 };
    this.#stick.style.transform = `translate(0px, 0px)`;
  }

  mutat() {
    this.#base?.classList.remove("hidden");
  }
  elrejt() {
    this.#elrejt();
  } // Tisztább leállítással

  #elrejt() {
    this.#base?.classList.add("hidden");
    this.#leallit();
  }

  getVektor() {
    return { ...this.#vektor };
  }
}
