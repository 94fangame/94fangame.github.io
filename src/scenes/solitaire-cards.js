import { loadBmpFonts, loadBtnTextures, loadCards, loadCharactersTxts, loadIcons } from "../utils/loaders.js";
import Button, { BtnSizes, BtnTypes } from "../components/button.js";
import Card, { CardSuits } from "../components/card.js";
import { Colors } from "../utils/colors.js";


export class SolitaireCards extends Phaser.Scene {
  constructor() {
    super({key: 'Solitaire cards'});
  }
  
  preload() {
    loadCards(this);
  }

  init(data) {
    this.reorder = data.reorder;
  }

  create() {
    if (!this.reorder && localStorage.getItem( 'savedCards' )) {
      // this.scene.start('Level', {game:'Solitaire'});
      this.scene.start('Solitaire');
    }

    const btnSave = this.add.existing(
      new Button(this, 190, 304, BtnTypes.COMMON, BtnSizes.LARGE, 'save', 'Save default')
    );

    // four-suited playing cards
    this.toSwap = null;
    
    const cardSize = 32;
    
    const displaySuit = (cardSuit, col=0)=>{
      for (let i = 0; i < 13; i++) {
        let x = (Math.floor(i/7) + 0.75 + col)*1.1;
        let y = (i % 7 + 1.5)*1.1;
        this.showCard(x * cardSize, y * cardSize, cardSuit, i, btnSave);
        //new Card(this, x * cardSize, y * cardSize, cardSuit, i + 1)
      }
    }
    displaySuit(CardSuits.HEARTS, 0);
    displaySuit(CardSuits.SPADES, 2.25);
    displaySuit(CardSuits.DIAMONDS, 4.5);
    displaySuit(CardSuits.CLOVERS, 6.75);

    //EXTRA CHARS.
    const extra_chars = 2;
    for (let i = 0; i < extra_chars; i++) {
      let x = 26+i*(cardSize+4)
      let y = 300;
      this.showCard(x, y, CardSuits.NONE, i, btnSave);
    }

    //TITLE
    this.add.bitmapText(184, 6, 'Pixel','Swap as you like!', 16)
      .setOrigin(0.5, 0).setTint(Colors.dark);
    this.add.image(72, 16, 'icon swap').setScale(2);
    
    const btnPlay = this.add.existing(
      new Button(this, 280, 304, BtnTypes.ACCENT, BtnSizes.MEDIUM, 'play', 'PLAY!')
    );
    btnPlay.on(Phaser.Input.Events.POINTER_UP, ()=>{
      // this.scene.start('Level', {game:'Solitaire'});
      this.scene.start('Solitaire');
    });

    btnSave.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      localStorage.setItem( 'savedCards', true );
      btnSave.setContent('Saved!', 'check');
    });
  }


  showCard(x_pos, y_pos, cardSuit, i, btnSave) {
    let aux = this.add.existing(
      new Card(this, x_pos, y_pos, cardSuit, i + 1)
    )
      .setInteractive();
    aux.on(Phaser.Input.Events.POINTER_UP, () => {
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
      btnSave.setContent('Save cards', 'save');
    });
  }
}