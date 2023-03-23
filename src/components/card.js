// import Phaser from "phaser";
import { characters } from "../constants/characters.js";
import { Colors } from "../utils/colors.js";

export const CardSuits = {
  HEARTS: 0,
  SPADES: 1,
  DIAMONDS: 2,
  CLOVERS: 3,

  NONE: 4,
}
export const CardColors = {
  RED: true,
  BLACK: false
}

export default class Card extends Phaser.GameObjects.Container {

  getCardIdx(cardSuit, num){
    return cardSuit + 5*(num-1);
  };

  constructor (scene, x, y, cardSuit, num) {
    super(scene, x, y);

    this.key = cardSuit+'.'+num; //'solitaire.'+
    this.cardSuit = cardSuit;
    this.num = num;
    this.color = cardSuit%2 == 0 ? CardColors.RED : CardColors.BLACK;

    this.bg = scene.add.image(0, 0, 'cards', this.getCardIdx(cardSuit, num));
    this.char = scene.add.image(-1, 0,
      localStorage.getItem( this.key ) ?? characters[(cardSuit*13) + (num-1)].name
    );
    this.back = scene.add.image(0, 0, 'card back');
    this.back.visible = false;

    this.add(this.bg);
    this.add(this.char);
    this.add(this.back);
    this.setSize(this.bg.width, this.bg.height);

    this.pressed = false;
    this.Tint = {
      DEFAULT: Colors.white,
      HOVER: Colors.light,
      CLICKED: Colors.accent.light,
    };

    // this.firstClickTime = (new Date()).getTime();
    // this.doubleClick = false;

    this.setInteractive()
      .on(Phaser.Input.Events.POINTER_OVER, ()=>{
        if(!this.pressed)
          this.bg.setTint(this.Tint.HOVER);
      })
      .on(Phaser.Input.Events.POINTER_OUT, ()=>{
        if(!this.pressed)
          this.bg.setTint(this.Tint.DEFAULT);
      })
      .on(Phaser.Input.Events.POINTER_DOWN, ()=>{
        this.pressed = !this.pressed;
        this.bg.setTint(this.Tint.CLICKED);
      })
      .on(Phaser.Input.Events.POINTER_UP, ()=>{
        if(!this.pressed)
          this.bg.setTint(this.Tint.HOVER);
      })

  }

  setActive(active) {
    this.active = active;
    if (active) {
      this.setAlpha(1);
      this.setInteractive();
      this.bg.setTint(this.Tint.DEFAULT);
    } else {
      this.removeInteractive();
      this.setAlpha(0.5);
      this.bg.setTint(Colors.dark);
    }
  }

  getCharacter() {
    return this.char.texture.key;
  }
  setCharacter(charTxtr) {
    this.char.setTexture(charTxtr);
    localStorage.setItem(this.key, this.char.texture.key);
  }
  resetPressed() {
    this.bg.setTint(this.Tint.DEFAULT);
    this.pressed = false;
  }

  flip() {
    this.back.visible = !this.back.visible;
  }
  getIsFaceDown() {
    return this.back.visible;
  }

  // this.lastClickT
  // isDoubleClick() {
  //   if (this.getIsFaceDown()) { return false; }
  //   let getTime = ()=>{ return (new Date()).getTime(); };
  //   console.log('t: ' + this.firstClickTime);
  //   if (this.firstClickTime == 0) {
  //     this.firstClickTime = getTime();
  //     // console.log('one click');
  //     return true;
  //   }
  //   let elapsed = getTime() - this.firstClickTime;
  //   let isDC = elapsed < 350; //350 //600
  //   console.log(isDC + ' ' + elapsed);
  //   // if (isDC) { console.log("double click"); }
  //   this.firstClickTime = 0;
  //   return isDC;
  // }

  isDiffColor(card) {
    return this.color != card.color;
  }
  isSameSet(card) {
    return this.cardSuit == card.cardSuit;
  }
  isNext(card) {
    return this.isSameSet(card) && this.num+1 == card.num;
  }
  isPrev(card) {
    return this.isSameSet(card) && this.num-1 == card.num;
  }
}