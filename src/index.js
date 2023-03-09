// import { ChooseCharacters } from "./scenes/choose-chars.js";
// import { ClickGame } from "./scenes/game-click.js";
// import { Level } from "./scenes/choose-level.js";
import { ChooseGame } from "./scenes/choose-game.js";
import { NonogramLvls } from "./scenes/nonogram-lvls.js";
import { Nonogram } from "./scenes/nonogram.js";
import { SolitaireCards } from "./scenes/solitaire-cards.js";
import { Solitaire } from "./scenes/solitaire.js";

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 320,
  parent: "container",
  transparent: true,
  pixelArt: true,
  zoom: 2,
  scene: [ChooseGame, NonogramLvls, Nonogram, SolitaireCards, Solitaire], //
  // physics: {
  //   default: "";
  // }
}

var game = new Phaser.Game(config);