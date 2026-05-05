import Jatekos from "./Jatekos.js";
import Collectibles from "./Collectibles.js";

export default class Jatekter {
  #meret = { width: 100, height: 100 };
  #jatekos;
  #szuloElem;
  #targyak;
  #jatekosMeret = 10;
  
  #keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
  };

  #sebesseg = 0.8; // Sebesség százalékban (mivel másodpercenként 60x fut le)

  constructor(szuloElem, pokemonData) {
    this.#szuloElem = szuloElem;
    this.init(pokemonData);
  }

  init(pokemonData) {
    this.#jatekos = new Jatekos(pokemonData, this.#szuloElem);
    
    this.#targyak = new Collectibles(this.#szuloElem);

    this.esemenyfigyelok();
    this.updateInfoPanel();
    
    this.gameLoop();
  }

  /**
   * Csak a naplót (keys) frissítjük, nem itt mozgatunk!
   */
  esemenyfigyelok() {
    window.addEventListener("keydown", (e) => {
      if (e.key in this.#keys) this.#keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.key in this.#keys) this.#keys[e.key] = false;
    });
  }

  /**
   * Folyamatosan futó ciklus (requestAnimationFrame = ~60 FPS)
   */
  gameLoop() {
    this.frissites();
    requestAnimationFrame(() => this.gameLoop());
  }

  frissites() {
    let { x, y } = this.#jatekos.getHelyzet();
    let dx = 0;
    let dy = 0;

    if (this.#keys.ArrowUp)    dy -= 1;
    if (this.#keys.ArrowDown)  dy += 1;
    if (this.#keys.ArrowLeft)  dx -= 1;
    if (this.#keys.ArrowRight) dx += 1;

    if (dx !== 0 || dy !== 0) {
      x += dx * this.#sebesseg;
      y += dy * this.#sebesseg;

      if (x < 0) x = 0;
      if (x > this.#meret.width - this.#jatekosMeret) x = this.#meret.width - this.#jatekosMeret;
      if (y < 0) y = 0;
      if (y > this.#meret.height - this.#jatekosMeret) y = this.#meret.height - this.#jatekosMeret;

      this.#jatekos.setHelyzet({ x, y, dx, dy });
      
      this.utkozesEllenorzes();
    }
  }

  utkozesEllenorzes() {
    const jatekosPos = this.#jatekos.getHelyzet();
    const jelenlegiTargyak = this.#targyak.lista;
    
    for (let i = jelenlegiTargyak.length - 1; i >= 0; i--) {
      const targy = jelenlegiTargyak[i];
      const targyPos = targy.getPozicio();

      if (
        jatekosPos.x < targyPos.x + targyPos.meret &&
        jatekosPos.x + this.#jatekosMeret > targyPos.x &&
        jatekosPos.y < targyPos.y + targyPos.meret &&
        jatekosPos.y + this.#jatekosMeret > targyPos.y
      ) {
        this.#jatekos.targyFelvesz();
        
        this.#targyak.tavolit(i);
        
        this.updateInfoPanel();

        if (this.#targyak.darabszam === 0) {
          this.#targyak.ujratolt();
        }
      }
    }
  }

  updateInfoPanel() {
    const nevElem = document.getElementById("player-name");
    const pontElem = document.getElementById("player-score");
    if (nevElem) nevElem.innerText = this.#jatekos.getNev();
    if (pontElem) pontElem.innerText = this.#jatekos.getPontszam();
  }
}