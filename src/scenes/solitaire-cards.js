import { loadBmpFonts, loadBtnTextures, loadCards, loadCharactersTxts } from "../utils/loaders.js";
import Button, { BtnSizes, BtnTypes } from "../components/button.js";
import Card, { CardSuits } from "../components/card.js";


export class SolitaireCards extends Phaser.Scene {
  constructor() {
    super({key: 'Solitaire cards'});
  }
  
  preload() {
    loadCards(this);
    loadBmpFonts(this);
    loadBtnTextures(this);
    loadCharactersTxts(this);
  }

  init(data) {
    this.reorder = data.reorder;
  }

  create() {
    if (!this.reorder && localStorage.getItem( 'savedCards' )) {
      this.scene.start('Solitaire');
    }

    const btnSave = this.add.existing(new Button(this, 64, 304, BtnTypes.COMMON, BtnSizes.LARGE, 'Save default'));

    // four-suited playing cards
    this.toSwap = null;
    
    const cardSize = 32;
    
    const displaySuit = (cardSuit, col=0)=>{
      for (let i = 0; i < 13; i++) {
        let x = (Math.floor(i/7) + 0.75 + col)*1.1;
        let y = (i % 7 + 1.5)*1.1;
        let aux = this.add.existing(
          new Card(this, x * cardSize, y * cardSize, cardSuit, i+1)
        )
        .setInteractive();
        aux.on(Phaser.Input.Events.POINTER_UP, ()=>{
          // console.log( aux.getCharacter() );
          if (this.toSwap == null) {
            this.toSwap = aux;
          } else {
            if (this.toSwap == aux) {
              this.toSwap = null;
            }
            else {
              let auxTxt = aux.getCharacter();
              aux.setCharacter(this.toSwap.getCharacter());
              this.toSwap.setCharacter(auxTxt);
              aux.resetPressed();
              this.toSwap.resetPressed();
              this.toSwap = null;
            }
          }
          btnSave.setText('Save cards');
        });
      }
    }
    displaySuit(CardSuits.HEARTS, 0);
    displaySuit(CardSuits.SPADES, 2.25);
    displaySuit(CardSuits.DIAMONDS, 4.5);
    displaySuit(CardSuits.CLOVERS, 6.75);

    //TITLE
    this.add.bitmapText(160, 8, 'Pixel','Swap as you like!')
      .setOrigin(0.5, 0).setFontSize(8);
    
    const btnPlay = this.add.existing(new Button(this, 280, 304, BtnTypes.ACCENT, BtnSizes.MEDIUM, 'PLAY!'));
    btnPlay.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      this.scene.start('Solitaire');
    });

    btnSave.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      localStorage.setItem( 'savedCards', true );
      btnSave.setText('Saved!');
    });
  }

}