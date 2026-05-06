import Billentyuzet from "./Billentyuzet.js";
import Joystick from "./Joystick.js";

export default class Iranyitas {
  #billentyuzet;
  #joystick;
  #joystickAktiv = false;

  constructor() {
    this.#billentyuzet = new Billentyuzet();
    this.#joystick = new Joystick();

    this.#toggleInicializalas();
  }

  /**
   * Összeköti a HTML gombot a Joystick láthatóságával
   */
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
   * Kiszámolja a következő pozíciót a prioritások figyelembevételével.
   * Ezt hívja meg a Jatekter a gameLoop-ban.
   */
  kovetkezoHelyzet(jelenlegiPos, sebesseg) {
    // 1. Lekérjük a billentyűzet adatait
    let vektor = this.#billentyuzet.getVektor();

    // 2. Prioritás: Ha a billentyűzet áll (0,0) ÉS a joystick be van kapcsolva
    if (vektor.dx === 0 && vektor.dy === 0 && this.#joystickAktiv) {
      vektor = this.#joystick.getVektor();
    }

    // 3. Mozgás számítása
    let ujX = jelenlegiPos.x + vektor.dx * sebesseg;
    let ujY = jelenlegiPos.y + vektor.dy * sebesseg;

    // 4. Határellenőrzés (90% mert a karakter szélessége kb 10%)
    ujX = Math.max(0, Math.min(90, ujX));
    ujY = Math.max(0, Math.min(90, ujY));

    // Visszaadjuk a teljes csomagot, amit a Jatekos.setHelyzet() vár
    return {
      x: ujX,
      y: ujY,
      dx: vektor.dx,
      dy: vektor.dy,
    };
  }
}
