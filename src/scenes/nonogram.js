import Button, { BtnSizes, BtnTypes } from "../components/button.js";
import Congrats from "../components/congrats.js";
import { Colors } from "../utils/colors.js";
import { loadBmpFonts, loadBtnTextures, loadCharactersTxts, loadIcons } from "../utils/loaders.js";

export class Nonogram extends Phaser.Scene {
  constructor() {
    super({key: 'Nonogram'});
  }

  preload() {
    loadBtnTextures(this);
    loadIcons(this);
    this.load.spritesheet('hearts','./assets/ui/hearts.png', {frameWidth: 16, frameHeight: 16});
    this.load.image('congrats','./assets/ui/congrats.png');
    this.load.image('lose','./assets/ui/losing.png');
    // loadCharactersTxts(this);
    // loadBmpFonts(this);
    // this.load.image( 'frame', './assets/ui/frame.png' );
  }

  init(data) {
    this.character = data.char;
    // this.character = 'Draluc'; 
  }

  create() {
    const side = 25;
    const pxSide = 8;
    let gC = {
      x: 160,
      y: 160,
      sLong: (side+6)*pxSide,
      sShort: side*pxSide,
      sNums: pxSide*6,
    };
    const gTop = {
      x: 320-gC.x-gC.sLong/2,
      y: 320-gC.y-gC.sLong/2,
    }
    const pTop = {
      x: gTop.x + gC.sNums,
      y: gTop.y + gC.sNums,
    };

    let isClicking = false;
    let isPainting = true;
    const bottomY = 312;
    let qToComplete = 0;
    let qCompleted = 0;
    // let win = false;

    // GRID
    // Colors
    let grid = [];
    let img = this.add.image(pTop.x+(side-1)*pxSide/2, pTop.y+(side-1)*pxSide/2,this.character).setScale(pxSide).setVisible(false);
    for (let y = 0; y < side; y++) {
      let row = [];
      for (let x = 0; x < side; x++) {
        let color = this.textures.getPixel(x, y, img.texture.key);
        let tp = color != null && color.alpha > 128 && color.v < 0.5;
        row.push({ isPaint: tp, obj: null });
        if (tp) { qToComplete++; }
      }
      grid.push(row);
    }


    let hearts = [];
    let livesLost = 0, maxLives = 5;
    for (let i = 0; i < maxLives; i++) {
      hearts.push( this.add.image(144 + i * 20, 16, 'hearts', 0) );
    }


    let btnPaint = new Button(this, 174+9, bottomY, BtnTypes.EMPTY, BtnSizes.ICON, '', '');
    let btnBlock = new Button(this, 174-9, bottomY, BtnTypes.EMPTY, BtnSizes.ICON, '', 'x');
    btnPaint.setTint(Colors.accent.light);
    btnPaint.add( this.add.rectangle(0, -1, 6, 6, Colors.dark) )
    btnPaint.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      isPainting = true;
      btnPaint.setTint(Colors.accent.light);
      btnBlock.setTint(Colors.light);
    });
    btnBlock.on(Phaser.Input.Events.POINTER_DOWN, ()=>{
      isPainting = false;
      btnBlock.setTint(Colors.accent.light);
      btnPaint.setTint(Colors.light);
    });
    this.add.existing(btnPaint);
    this.add.existing(btnBlock);
    let btnRetry = this.add.existing( new Button(this, 288, bottomY, BtnTypes.COMMON, BtnSizes.SMALL, 'retry', 'Retry') );
    
    const getXYworld = (x, y)=>{
      x = pTop.x + (x+.5)*pxSide -0.5;
      y = pTop.y + (y+.5)*pxSide;
      return {x:x, y:y};
    };

    const paintX = (x=0, y=0, isOk=true)=>{
      let curr = grid.at(y).at(x);
      // curr.obj.destroy();
      curr.obj.setVisible(false);
      let pos = getXYworld(x,y);
      this.add.bitmapText(pos.x+1, pos.y, 'Pixel', 'X', 8)
        .setOrigin(0.5).setAlpha(0.5)
        .setTint(isOk ? Colors.primary.dark : Colors.primary.light);
    }
    
    const validateCell = (r, x, y)=>{
      if (grid.at(y).at(x).isPaint != isPainting) {
        if (livesLost < maxLives) {
          hearts[livesLost].setTexture('hearts', 1);
          livesLost++;
          if (livesLost == maxLives) {
            console.log('No more lives :c');
            this.add.bitmapText(168, 136, 'Pixel bold','No lives left :c').setOrigin(0.5).setTint(Colors.primary.dark);
            this.add.image(168, 192, 'lose');
            r.setActive(false);
          }
        }
      }
      if (livesLost != maxLives) {
        if (grid.at(y).at(x).isPaint) {
          qCompleted ++;
          r.setFillStyle(isPainting ? Colors.dark : Colors.primary.light);
          r.removeInteractive();
          // console.log(qCompleted + '/' + qToComplete);
        } else { paintX(x, y, !isPainting); }
        if (qCompleted == qToComplete) {
          this.add.existing( new Congrats(this) );
          localStorage.setItem(this.character, true);
          // this.scene.start('Nonogram lvls');
        }
      }
    };

    for (let y = 0; y < side; y++) {
      for (let x = 0; x < side; x++) {
        let pos = getXYworld(x,y);
        let r = grid.at(y).at(x);
        r.obj = this.add.rectangle( pos.x, pos.y, pxSide*2 +0.5, pxSide*2 +2)
                .setScale(0.5).setInteractive();
                //, grid.at(y).at(x).isPaint ? Colors.dark : Colors.white
      }
    }
    this.input.on(Phaser.Input.Events.POINTER_UP, ()=>{ isClicking = false; });

    
    //grilla pixeles
    this.add.grid(gC.x, gC.y+gC.sNums/2, gC.sLong*2, gC.sShort*2, gC.sLong*2, pxSide*2)
      .setOutlineStyle(Colors.primary.dark, 0.1)
      .setScale(0.5);
    this.add.grid(gC.x+gC.sNums/2, gC.y, gC.sShort*2, gC.sLong*2, pxSide*2, gC.sLong*2)
      .setOutlineStyle(Colors.primary.dark, 0.1)
      .setScale(0.5);
    //grilla cada 6
    // this.add.grid(gC.x, gC.y, gC.sLong*2, gC.sLong*2, pxSide*12, pxSide*12)
    // .setOutlineStyle(Colors.primary.dark, 0.3)
    // .setScale(0.5);
    //grilla cada 5
    this.add.grid(gC.x, gC.y+gC.sNums/2, gC.sLong*2, gC.sShort*2, gC.sLong*2, pxSide*10)
      .setOutlineStyle(Colors.primary.dark, 0.3)
      .setScale(0.5);
    this.add.grid(gC.x+gC.sNums/2, gC.y, gC.sShort*2, gC.sLong*2, pxSide*10, gC.sLong*2)
      .setOutlineStyle(Colors.primary.dark, 0.3)
      .setScale(0.5);
    //borde esterno
    this.add.existing( 
      this.add.graphics()
        .lineStyle(1, Colors.primary.dark)
        .strokeRect(pTop.x, pTop.y, gC.sShort, gC.sShort)
    );
    

    //NUMS
    //per ROW
    let txtRows = [];
    for (let y = 0; y < side; y++) {
      let txtRow = [];
      let q = 0;
      let all0 = true;
      for (let x = side-1; x >= -1; x--) {
        if (x>=0 && grid.at(y).at(x).isPaint ) {
          q++;
          all0 = false;
        }
        else {
          if (q!=0) {
            txtRow.push(
              this.add.bitmapText(
                gTop.x + gC.sNums - txtRow.length*10 -5,
                pTop.y+2 + y*pxSide,
                'Pixel', q, 6)
                .setOrigin(0.5, 0)
                .setTint(Colors.primary.dark).setAlpha(0.5)
            );
          }
          q = 0;
        }
      }
      if (all0) {
        for (let x = 0; x < side; x++) { paintX(x, y, true); }
      }
      txtRows.push(txtRow);
      // this.add.bitmapText(gTop.x + gC.sNums -1, pTop.y+2 + y*pxSide, 'Pixel', txt, 6)
      //   .setOrigin(1, 0).setTint(Colors.primary.dark).setAlpha(0.5);
    }
    //per COL
    let txtCols = [];
    for (let x = 0; x < side; x++) {
      let txtCol = []
      let q = 0;
      let all0 = true;
      for (let y = side-1; y >= -1; y--) {
        if (y>=0 && grid.at(y).at(x).isPaint ) {
          q++;
          all0 = false;
        }
        else {
          if (q!=0) {
            txtCol.push(
              this.add.bitmapText(
                pTop.x+2 + x*pxSide,
                gTop.y + gC.sNums - txtCol.length*10 -5,
                'Pixel', q, 6)
                .setOrigin(0, 0.5)
                .setTint(Colors.primary.dark).setAlpha(0.5)
            );
          }
          q = 0;
        }
      }
      if (all0) {
        for (let y = 0; y < side; y++) { paintX(x, y, true); }
      }
      txtCols.push(txtCol);
      // this.add.bitmapText(pTop.x + x*pxSide +2, gTop.y + gC.sNums -1, 'Pixel', txt, 6)
      //   .setOrigin(0, 1).setTint(Colors.primary.dark).setAlpha(0.5);
    }


    grid.forEach( (row, y) => {
      row.forEach( (r, x) => {
        r.obj.on(Phaser.Input.Events.POINTER_OVER, ()=>{
          r.obj.setFillStyle(Colors.primary.dark, 0.1);
          if (isClicking == true) {
            validateCell(r.obj, x, y);
          }
        }).on(Phaser.Input.Events.POINTER_OUT, ()=>{
          r.obj.fillAlpha = 0;
        }).on(Phaser.Input.Events.POINTER_DOWN, ()=>{
          validateCell(r.obj, x, y);
          isClicking = true;
        }).on(Phaser.Input.Events.POINTER_UP, ()=>{
          r.obj.setFillStyle(Colors.primary.dark, 0.1);
        });
      });
    });
    
    
    let btnExit = this.add.existing( new Button(this, 32, bottomY, BtnTypes.COMMON, BtnSizes.SMALL, 'cancel', 'Exit') );
    btnExit.on(Phaser.Input.Events.POINTER_UP, ()=>{
      this.scene.start('Nonogram lvls');
    });
    btnRetry.on(Phaser.Input.Events.POINTER_UP, ()=>{
      this.scene.restart({char: this.character});
    });
  }
}