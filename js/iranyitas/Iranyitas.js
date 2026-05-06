import Billentyuzet from "./Billentyuzet.js";
import Joystick from "./Joystick.js";

export default class Iranyitas {
  #billentyuzet;
  #joystick;
  #joystickAktiv = false;
  #deadzone = 0.1; // 10% alatti kitérést figyelmen kívül hagyunk

  constructor() {
    this.#billentyuzet = new Billentyuzet();
    this.#joystick = new Joystick();

    this.#toggleInicializalas();
  }

  #toggleInicializalas() {
    const btn = document.getElementById("joy-toggle");

    btn?.addEventListener("click", () => {
      this.#joystickAktiv = !this.#joystickAktiv;

      if (this.#joystickAktiv) {
        btn.innerText = "Joystick: BE";
        this.#joystick.mutat();
      } else {
        btn.innerText = "Joystick: KI";
        this.#joystick.elrejt();
      }
    });
  }

  /**
   * Összefésüli a bemeneteket és visszaadja a végleges adatokat
   */
  kovetkezoHelyzet(jelenlegiPos, sebesseg) {
    // 1. Billentyűzet lekérése (Digitális: 0 vagy 1)
    let bVektor = this.#billentyuzet.getVektor();
    let veglegesVektor = { dx: bVektor.dx, dy: bVektor.dy };

    // 2. Ha a billentyűzeten nincs mozgás ÉS a joystick aktív
    if (
      veglegesVektor.dx === 0 &&
      veglegesVektor.dy === 0 &&
      this.#joystickAktiv
    ) {
      const jVektor = this.#joystick.getVektor();

      // Holttér ellenőrzése: Csak akkor használjuk, ha elég nagy a kitérés
      const kiteresMerteke = Math.sqrt(jVektor.dx ** 2 + jVektor.dy ** 2);

      if (kiteresMerteke > this.#deadzone) {
        veglegesVektor.dx = jVektor.dx;
        veglegesVektor.dy = jVektor.dy;
      }
    }

    // 3. Új pozíció kiszámítása (veglegesVektor már tartalmazza a boost-ot a Joystick.js-ből)
    let ujX = jelenlegiPos.x + veglegesVektor.dx * sebesseg;
    let ujY = jelenlegiPos.y + veglegesVektor.dy * sebesseg;

    // 4. Határellenőrzés (a játéktér 100%-os, karakter kb 10%)
    ujX = Math.max(0, Math.min(90, ujX));
    ujY = Math.max(0, Math.min(90, ujY));

    // Visszatérünk a Jatekos.setHelyzet számára emészthető formátummal
    return {
      x: ujX,
      y: ujY,
      dx: veglegesVektor.dx,
      dy: veglegesVektor.dy,
    };
  }
}
