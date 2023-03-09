import { Colors } from "../utils/colors.js";
import { loadBmpFonts, loadBtnTextures, loadCharactersTxts, loadIcons } from "../utils/loaders.js";

export class ChooseGame extends Phaser.Scene {

  constructor() {
    super({key: 'Choose Game'});
  }

  preload() {
    loadCharactersTxts(this);
    loadBmpFonts(this);
    loadBtnTextures(this);
    loadIcons(this);
    this.load.image('nono', './assets/ui/game_nono.png');
    this.load.image('soli', './assets/ui/game_sol.png');
  }

  create() {
    this.add.bitmapText(160, 16, 'Pixel', 'Choose the game', 16)
      .setOrigin(0.5, 0).setTint(Colors.dark).setCenterAlign();

    let soli = this.add.image(96, 160, 'soli')
      .setScale(0.1)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, ()=>{
        this.scene.start('Solitaire cards');
      });
    soli.on(Phaser.Input.Events.POINTER_UP, ()=>{
      soli.setTint(Colors.hover);
    }).on(Phaser.Input.Events.POINTER_OVER, ()=>{
      soli.setTint(Colors.hover);
    }).on(Phaser.Input.Events.POINTER_OUT, ()=>{
      soli.clearTint();
    });
    let nono = this.add.image(320-96, 160, 'nono')
      .setScale(0.1)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, ()=>{
        this.scene.start('Nonogram lvls');
      });
    nono.on(Phaser.Input.Events.POINTER_UP, ()=>{
      nono.setTint(Colors.hover);
    }).on(Phaser.Input.Events.POINTER_OVER, ()=>{
      nono.setTint(Colors.hover);
    }).on(Phaser.Input.Events.POINTER_OUT, ()=>{
      nono.clearTint();
    });
    this.add.bitmapText(96, 160+48, 'Pixel', 'Solitaire', 16)
      .setOrigin(0.5, 0).setTint(Colors.dark);
    this.add.bitmapText(320-96, 160+48, 'Pixel', 'Nonogram', 16)
      .setOrigin(0.5, 0).setTint(Colors.dark);
  }
}