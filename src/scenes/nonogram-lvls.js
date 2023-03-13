import { Colors } from "../utils/colors.js";
import { characters } from "../constants/characters.js";
import Button, { BtnSizes, BtnTypes } from "../components/button.js";

export class NonogramLvls extends Phaser.Scene {
  constructor() {
    super({key: 'Nonogram lvls'});
  }

  preload() {
    this.load.image( 'frame', './assets/ui/frame.png' );
  }

  // init(data) {}

  create() {
    let selected = null;
    const imgCharSize = 40;
    const maxCPerRow = 7;
    let row = 1;
    let col = -1;

    this.chars = characters.map( c => {
      if (col == maxCPerRow) {
        col = -1;
        row ++;
      }
      col ++;
      let aux = this.add.image(
        col * imgCharSize + imgCharSize/2,
        row * imgCharSize + imgCharSize/2,
        c.name ).setInteractive();
      if ( localStorage.getItem(c.name) == undefined ) {
        aux.setTint(Colors.black);
      }
      aux.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
        if (selected != null && selected.char == aux) {
          this.scene.start('Nonogram', {char: aux.texture.key});
        }
        else {
          if (selected != null) selected.destroy();
          selected = this.add.image(aux.x, aux.y, 'frame');
          selected.char = aux;
        }
      });
      return aux;
    });

    this.add.bitmapText(160, 6, 'Pixel', 'Double click to play!', 16)
      .setOrigin(0.5, 0).setTint(Colors.dark);
    // this.chars.forEach (c => {
    //   c.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
    //     if (!addTexture(c)) {
    //       selected.get( c.texture.key ).destroy();
    //       selected.delete( c.texture.key );
    //     }
    //     btnPlay.setActive(selected.size > 2);
    //   })
    // });
    
    this.btnExit = new Button(this, 320-32, 320-16, BtnTypes.CANCEL, BtnSizes.MEDIUM, 'cancel', 'Exit');
    this.btnExit.on(Phaser.Input.Events.POINTER_UP, ()=>{
      this.scene.start('Choose Game');
    });
    this.add.existing( this.btnExit );
  }
}