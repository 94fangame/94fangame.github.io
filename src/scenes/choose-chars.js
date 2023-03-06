import characters from "../constants/characters.json" assert { type: "json" };
import Button, { BtnSizes, BtnTypes } from "../components/button.js";
import { loadBmpFonts, loadBtnTextures, loadCharactersTxts } from "../utils/loaders.js";

const imgcharactersize = 32;
let selected = new Map();

export class ChooseCharacters extends Phaser.Scene {

  constructor() {
    super({key: 'choose characters'});
  }

  preload() {
    loadBmpFonts(this);
    loadBtnTextures(this);
    loadCharactersTxts(this);

    this.load.image( 'frame', './assets/ui/frame.png' );
  }

  create() {
    const maxCPerRow = 8;
    let row = 1;
    let col = -1;

    this.chars = characters.map( c => {
      if (col == maxCPerRow) {
        col = -1;
        row ++;
      }
      col ++;
      let aux = this.add.image(
        col * imgcharactersize + imgcharactersize/2,
        row * imgcharactersize + imgcharactersize/2,
        c.name ).setInteractive();
      return aux;
    });

    
    const addTexture = (c)=>{
      if (!selected.has( c.texture.key )) {
        let aux = this.add.image(c.x, c.y, 'frame');
        selected.set(c.texture.key, aux);
        return true
      }
      return false;
    }

    this.chars.forEach (c => {
      c.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
        if (!addTexture(c)) {
          selected.get( c.texture.key ).destroy();
          selected.delete( c.texture.key );
        }
        btnPlay.setActive(selected.size > 2);
      })
    });

    this.add.bitmapText(160, 0, 'Pixel bold','Select with which characters to play!')
      .setOrigin(0.5, 0).setFontSize(8);
    this.add.bitmapText(160, 16, 'Pixel', '(At least 3)')
      .setOrigin(0.5, 0).setFontSize(8);
    
    const btnAll   = this.add.existing(new Button(this, 32, 280, BtnTypes.COMMON, BtnSizes.MEDIUM, 'Select all'));
    btnAll.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      this.chars.forEach (c => addTexture(c));
      btnPlay.setActive(true);
    });

    const btnClear = this.add.existing(new Button(this, 104, 280, BtnTypes.COMMON, BtnSizes.MEDIUM, 'Clear'));
    btnClear.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      selected.forEach( v => {v.destroy();} );
      selected.clear();
      btnPlay.setActive(false);
    })
    
    const btnPlay  = this.add.existing(new Button(this, 256, 280, BtnTypes.ACCENT, BtnSizes.MEDIUM, 'PLAY!'));
    btnPlay.setActive(false);
    btnPlay.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      this.scene.start('click game', { 'characters' : [...selected.keys()] });
      // if (selected.size > 2) {
      // }
    });
  }

}