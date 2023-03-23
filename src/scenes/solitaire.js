import Button, { BtnSizes, BtnTypes } from "../components/button.js";
import Card from "../components/card.js";
import LevelSelector, { Levels } from "../components/levelSelector.js";
import { Colors } from "../utils/colors.js";
// import { loadBmpFonts, loadBtnTextures, loadCards, loadCharactersTxts, loadIcons } from "../utils/loaders.js";

export class Solitaire extends Phaser.Scene {
  constructor() {
    super({key: 'Solitaire'});
  }

  preload() {
    this.load.image('congrats','./assets/ui/congrats.png');
  }

  init(data) {
    this.qCompleted = 0;
    this.pickedCard = null;
    this.actions = []; // {pickedCard, to, from}
    this.resetPicked = ()=>{
      if (this.pickedCard != null) {
        this.pickedCard.resetPressed();
        this.pickedCard = null;
      }
    }

    this.level = null;
    if (data && data.level != null) { this.level = data.level; }
    // localStorage.getItem( 'level' );
    // console.log('level ' + this.level);
    // localStorage.removeItem('level');
  }


  create() {
    //inicializar BOTONES
    const btnReorder = this.add.existing(
      new Button(this, 56, 304, BtnTypes.COMMON, BtnSizes.LARGE, 'swap', 'swap chars.')
    );
    const btnNewGame = this.add.existing(
      new Button(this, 134, 304, BtnTypes.EASY + this.level, BtnSizes.SMALL, 'new', 'New')
    );
    const btnChangeLvl = this.add.existing(
      new Button(this, 210, 304, BtnTypes.EASY + this.level, BtnSizes.LARGE, 'change-lvl', '+ options')//Change level
    );
    const btnBack = this.add.existing(
      new Button(this, 288, 304, BtnTypes.CANCEL, BtnSizes.SMALL, 'undo', 'Undo')
    );


    // POSICIONES DISPONIBLES
    const yTop = 24;
    const cardSize = 32;
    const availab = 320 - yTop*2;
    const space = (availab - cardSize*7)/7;
    const maxWx = cardSize + space;
    const maxXFound = 320 - yTop - 3*36;

    const stock = this.add.container( yTop, yTop );
    const stockStand = this.add.image( 0, 0, 'card line' ).setInteractive();
    stock.add( stockStand );
    const waste = this.add.container( yTop + cardSize*1.25, yTop );
    const tableau = this.add.container(yTop, cardSize*2);
    for (let i = 0; i < 8; i++) {
      let auxT = this.add.container(maxWx*i, 0);
      auxT.add( this.add.image( 0, 0, 'card line' ).setInteractive() );
      tableau.add ( auxT );
    }
    const foundation = this.add.container(maxXFound, yTop);
    for (let i = 0; i < 4; i++) {
      let auxC = this.add.container(i*36, 0 );
      auxC.add( this.add.image( 0, 0, 'card line' ).setInteractive() );
      foundation.add( auxC );
    }

    
    //LEVEL SELECTOR
    const openSelector = (canCancel=true)=>{
      this.add.existing( new LevelSelector(this, canCancel) );
    }
    if (this.level == null) {
      openSelector(false);
      return;
    }
    

    // AGREGAR CARTAS
    this.cards = [];
    const shuffle = (arr)=>{
      arr.sort((a, b) => 0.5 - Math.random());
    };
    const randInt = (max)=>{
      return Math.floor(Math.random() * max);
    }
    // SHUFFLEAR
    if (this.level == Levels.RANDOM) {
      for (let i = 0; i < 52; i++) {
        this.cards.push (
          this.add.existing(
            new Card(this, 0, 0, Math.floor(i/13), i%13+1)
          ).setInteractive()
        );
      }
      shuffle(this.cards);
    }
    else {
      this.cards.push([]);
      for (let i = 0; i < 13; i++) {
        for (let s = 0; s < 4; s++) {
          if (this.cards.at(this.cards.length-1).length == 13) {
            this.cards.push([]);
          }
          this.cards.at(this.cards.length-1).push (
            this.add.existing(
              new Card(this, 0, 0, s, i+1)
            ).setInteractive()
          );
        }
      }
      if (this.cards.at(this.cards.length-1).length == 0) { this.cards.pop(); }
      // console.log(parts.length + ' ' + parts.at(parts.length-1).length);
      this.cards.forEach( p => { shuffle(p); });

      const swapParts = (qToSwap)=>{
        for (let i=0; i<qToSwap; i++) {
          let piMax = this.cards.length;
          let p1 = randInt(piMax);
          let p2 = randInt(piMax);
          if (p2 == p1) {
            if(p2 == 0) {p2 = piMax-1;}
            else if(p2 == piMax-1) { p2 = 0; }
            else { p2 = p1+1; }
          }
          p1 = this.cards.at(p1);
          p2 = this.cards.at(p2);
          let c1 = randInt(p1.length-1);
          let c2 = randInt(p2.length-1);
          c1 = p1.splice(c1, 1).at(0);
          c2 = p2.splice(c2, 1).at(0);
          p1.splice(randInt(p1.length-1), 0, c2);
          p2.splice(randInt(p2.length-1), 0, c1);
        }
      }
      
      switch (this.level) {
        case Levels.EASY:
          swapParts(8);
          break;
        case Levels.MEDIUM:
          swapParts(13);
          break;
      }
      this.cards = this.cards.flat();
    }
    // this.cards.forEach( c=>console.log(c) );

     
    // ... + CLICKS
    
    // From waste to stock
    stockStand.on(Phaser.Input.Events.POINTER_UP, ()=>{
      waste.getAll().reverse().forEach( cw => {
        stock.add( cw );
        cw.setPosition(0,0);
        cw.flip();
      } );
      waste.removeAll();
      this.actions.push( {picked:stock, from:waste} );
      // console.log('action: flip all');
    });

    
    // CARD movements
    const rowSpace = 0.4*cardSize;

    const moveFromTableau = (to)=>{
      // if (from.parentContainer != tableau) return;
      let from = this.pickedCard.parentContainer;
      let toCont = to.parentContainer;
      
      //SOLO PUEDE MOVER DE TABLEAU A FOUNDATION SI ES LA ÚLTIMA CARTA SELECCIONADA
      if ( !(toCont != tableau && this.pickedCard != from.getAt(from.length-1)) ) {
        if (toCont == foundation && this.pickedCard.num == 13) {
          this.qCompleted ++;
          if (this.qCompleted >= 4) {
            // console.log("(you won!!)");
            this.add.bitmapText(160, 136, 'Pixel bold','YOU WON!!!').setOrigin(0.5).setTint(Colors.accent.main);
            this.add.image(160, 192, 'congrats');
            btnBack.destroy();
          }
        }

        const pickedI = from.getIndex(this.pickedCard);
        while (pickedI > 0 && pickedI < from.length) {
          // console.log('from tableau ' + pickedI);
          let curr = from.getAt(pickedI);
          from.remove( curr );
          to.add( curr );
          curr.setPosition(0, toCont == tableau ? (to.length-2)*rowSpace : 0);
        }
  
        if (from.length > 1) {
          let before = from.getAt(from.length-1);
          if (before.getIsFaceDown()) {before.flip()};
        }
        
        this.actions.push( {picked:this.pickedCard, from:from} );
        // console.log('action: move from tableau');
      }
    }

    const movePicked = (to)=>{
      let from = this.pickedCard.parentContainer;
      // console.log(this.pickedCard.getCharacter() + ' ' + to.length + ' a tablero');
      if (to == from) { return; }
      if (from.parentContainer == tableau) {
        moveFromTableau(to);
      }
      else {
        from.remove(this.pickedCard);
        to.add(this.pickedCard);
  
        this.pickedCard.setPosition( 0,
          to.parentContainer == tableau ? (to.length-2)*rowSpace : 0 );

        this.actions.push( {picked:this.pickedCard, from:from} );
        // console.log('action: move');
      }
    }


    foundation.getAll().forEach( f => {
      f.getFirst()
        .on(Phaser.Input.Events.POINTER_UP, ()=>{
          // console.log('to foundation');
          if (this.pickedCard != null && this.pickedCard.num == 1) {
            movePicked(f);
          }
          this.resetPicked();
        });
    });
    
    tableau.getAll().forEach( t => {
      t.getFirst()
        .on(Phaser.Input.Events.POINTER_DOWN, ()=>{
          // console.log('[to tableau');
          if (this.pickedCard.num == 13) {
            movePicked(t);
          }
          // console.log('to tableau]');
        });
    } );
    
    // Card
    const addCard = (parent, y=0, flipped=true)=>{
      let aux = this.cards.pop();
      parent.add(aux);
      aux.y = y;
      this.children.bringToTop(aux);
      if (flipped) {aux.flip()};
      aux.on(Phaser.Input.Events.POINTER_UP, ()=>{
        // console.log('click en ' + aux.cardSuit + ': ' + aux.num);
        if (this.pickedCard == aux) {
          foundation.getAll().every( f => {
            let last = f.getAt(f.length-1);
            // console.log('nums' + aux.num + ' ' + last.num);
            if (aux.isPrev(last) || (aux.num == 1 && f.length == 1)) {
              // console.log("moviendo");
              movePicked(f);
              return false;
            }
            return true;
          });
          this.resetPicked();
        }
        else if (this.pickedCard == null) {
          if (aux.parentContainer == stock) {
            // console.log('es en stock');
            stock.remove(aux);
            waste.add(aux);
            aux.setPosition(0,0);
            aux.flip();
            aux.resetPressed();
            this.actions.push( {picked:aux, from:stock} );
            // console.log('action: move in stock');
          }
          else if(!aux.getIsFaceDown()) {
            // console.log('is face up');
            this.pickedCard = aux;
          }
        }
        else {
          // console.log('picked ' + this.pickedCard.cardSuit + ': ' + this.pickedCard.num);
          let from = this.pickedCard.parentContainer;
          let to = aux.parentContainer;
          let toCont = to.parentContainer;
          
          if ( from != stock && to != waste && to != stock) {
            if (toCont == foundation) {
              if ( aux.isNext(this.pickedCard) ) {
                movePicked(to);
              }
            }
            else if (toCont == tableau) {
              if (aux.num-1 == this.pickedCard.num
                && aux.isDiffColor(this.pickedCard)) {
                movePicked(to);
              }
            }
          }
          aux.resetPressed();
          this.resetPicked();
        }
      });
    }


    // REPARTIR CARTAS
    //to tableau
    let lastSaved = 0
    let d = 0, dq = 0; //diagonal
    while (d < 8) {
      while (dq <= d) {
        // console.log('d ' + d + '\t dq ' + dq + '\t' + (d-dq));
        addCard(tableau.getAt(7 - (d - dq)), dq*rowSpace, d != 7);
        lastSaved++;
        dq++;
      }
      dq = 0;
      d++;
    }
    // for (let i = 0; i < 8; i++) {
    //   for (let j = 0; j <= i; j++) {
    //     addCard(tableau.getAt(i), j*rowSpace, j!=i);
    //     lastSaved++;
    //   }
    // }
    //to stock
    for (let i = lastSaved; i < 52; i++) {
      addCard(stock, 0);
    }


    // BACK
    btnBack.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      if (this.actions.length > 0) {
        let lastAct = this.actions.pop();
        // console.log('action: ' + this.actions.length + ' ' + lastAct.picked.num);
        // console.log( 'lastAct: ' + this.actions.at(this.actions.length-1).picked);
        this.pickedCard = lastAct.picked;
        if (lastAct.from.parentContainer == tableau) {
          if (lastAct.from.length > 1) {
            let before = lastAct.from.getAt(lastAct.from.length-1);
            if (lastAct.from.length > 2) {
              let bbefore = lastAct.from.getAt(lastAct.from.length-2);
              if (bbefore.getIsFaceDown()) {before.flip();}
            }
            else if (!before.getIsFaceDown()) {before.flip();}
          }
        }
        if (lastAct.from == waste && this.pickedCard == stock) {
          stock.getAll().reverse().forEach( cw => {
            if ( cw.num ) {
              waste.add( cw );
              stock.remove( cw );
              cw.setPosition(0,0);
              cw.flip();
            }
          } );
          this.pickedCard = null;
        }
        else {
          movePicked(lastAct.from);
          if (lastAct.from == stock) { this.pickedCard.flip(); }
          this.actions.pop();
          this.resetPicked();
        }
      }
    });


    // BTN CLICKS
    btnReorder.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      this.scene.start('Solitaire cards'); //, {reorder:true}
    });
    btnChangeLvl.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      openSelector();
    });
    btnNewGame.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      this.scene.restart();
    });
  }
}