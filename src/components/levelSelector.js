import Button, { BtnSizes, BtnTypes } from "./button.js"
import { Colors } from "../utils/colors.js";

export const Levels = {
  EASY: 0,
  MEDIUM: 1,
  RANDOM: 2,
}

export default class LevelSelector extends Phaser.GameObjects.Container {
  constructor(scene, canCancel = true) {
    super(scene, 0, 0);

    // SET LEVEL
    let graphics = scene.add.graphics();
    // graphics.fillStyle(Colors.light, 0.5);
    graphics.fillGradientStyle(
      Colors.hover, Colors.hover, Colors.clicked, Colors.clicked,
      0.75, 0.75, 0.75, 0.75);
    graphics.fillRect(0, 0, 320, 320);
    graphics.fillStyle(Colors.light);
    graphics.fillRect(32, 32, 320-64, 320-64);
    graphics.lineStyle(2, Colors.primary.light);
    graphics.strokeRect(40, 40, 320-80, 320-80);
    this.add( graphics );

    let title = scene.add.bitmapText(160, 96, 'Pixel', 'Choose level').setOrigin(0.5).setTint(Colors.dark);
    this.add( title );

    let levels = [
      {type: Levels.EASY, txt:'easy'},
      {type: Levels.MEDIUM, txt: 'medium'},
      {type: Levels.RANDOM, txt: 'random'}
    ];
    this.lvl = null;
    levels.forEach( (lvl, i) => {
      let btn = new Button(scene, 160, 128 + i*28, BtnTypes.EASY+lvl.type, BtnSizes.MEDIUM, 'levels', lvl.txt);
      btn.setIcon('levels', i);
      btn.on(Phaser.Input.Events.POINTER_UP, ()=>{
        scene.scene.restart({level: lvl.type });
        // localStorage.setItem( 'level', lvl.type );
      });
      // scene.add.existing(btn);
      this.add( btn );
    });

    if (canCancel) {
      this.btnCancel = new Button(scene, 160, 224, BtnTypes.CANCEL, BtnSizes.MEDIUM, 'cancel', 'Cancel');
      // scene.add.existing(this.btnCancel);
      this.btnCancel.on(Phaser.Input.Events.POINTER_UP, ()=>{
        console.log('Cancel');
        this.destroy();
      });
      this.add( this.btnCancel );
    }
    this.btnExit = new Button(scene, 160, 256, BtnTypes.CANCEL, BtnSizes.MEDIUM, 'cancel', 'Exit');
    this.btnExit.on(Phaser.Input.Events.POINTER_UP, ()=>{
      scene.scene.start('Choose Game');
    });
    this.add( this.btnExit );
  }
}