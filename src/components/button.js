// import Phaser from "phaser";

import { Colors } from "../utils/colors.js";

export const BtnSizes = {ICON:1, SMALL:3, MEDIUM:4, LARGE:6};
export const BtnTypes = {COMMON:0, ACCENT:1, CANCEL:2, EASY:3, MEDIUM:4, HARD:5};

export default class Button extends Phaser.GameObjects.Container {
  
  constructor (scene, x, y, type=BtnTypes.COMMON, size=BtnSizes.MEDIUM, icon='', text='') {
    super(scene, x, y);
    
    this.img = scene.add.image( 0, 0, 'btn'+(type == BtnTypes.ACCENT ? '-g':'')+'_'+size );
    this.icon = scene.add.image( 0, 0, 'icon ' + icon);
    this.txt = scene.add.bitmapText(0, -1, 'Pixel', text.toUpperCase(), 24)
      .setOrigin(0.5);
    
    this.txt.setScale(0.33);
    this.icon.x -= ( this.txt.text.length*3 + 4 );
    this.txt.x += 6;
    
    
    this.add(this.img);
    this.add(this.txt);
    this.add(this.icon);
    this.setSize(this.img.width, this.img.height);
    
    this.Tint = {
      DEFAULT: Colors.primary.light,
      HOVER: Colors.primary.main,
      CLICKED: Colors.primary.dark,
    };
    if (type != BtnTypes.COMMON) {
      if (type == BtnTypes.ACCENT) {
        this.Tint = {
          DEFAULT: Colors.white,
          HOVER: Colors.accent.main,
          CLICKED: Colors.accent.dark,
        };
        this.txt.setTint(Colors.dark);
      }
      else {
        switch (type) {
          case BtnTypes.CANCEL:
            this.Tint.DEFAULT = Colors.dark; break;
          case BtnTypes.EASY:
            this.Tint.DEFAULT = 0x65AB40; break;
          case BtnTypes.MEDIUM:
            this.Tint.DEFAULT = Colors.accent.dark; break;
          case BtnTypes.HARD:
            this.Tint.DEFAULT = 0xC03533; break;
        }
        this.Tint.HOVER = this.Tint.DEFAULT + Colors.hover;
        this.Tint.CLICKED = this.Tint.DEFAULT + Colors.CLICKED;
      }
    }

    // Interactions
    this.setInteractive();
    this.img.setTint(this.Tint.DEFAULT);
    this
      .on(Phaser.Input.Events.POINTER_OVER, ()=>{
        this.img.setTint(this.Tint.HOVER);
        this.icon.setTint(Colors.light);
      })
      .on(Phaser.Input.Events.POINTER_OUT, ()=>{
        this.img.setTint(this.Tint.DEFAULT);
        this.icon.setTint(Colors.white);
      })
      .on(Phaser.Input.Events.POINTER_DOWN, ()=>{
        this.img.setTint(this.Tint.CLICKED);
      })
      .on(Phaser.Input.Events.POINTER_UP, ()=>{
        this.img.setTint(this.Tint.HOVER);
        this.icon.setTint(Colors.light);
      })

  }

  setActive(active=true) {
    this.active = active;
    if (active) {
      this.setAlpha(1);
      this.setInteractive();
      this.img.setTint(this.Tint.DEFAULT);
      this.icon.setTint(this.Tint.DEFAULT);
    } else {
      this.removeInteractive();
      this.setAlpha(0.5);
      this.img.setTint(Colors.dark);
      this.icon.setTint(Colors.dark);
    }
  }

  setText(text='') {
    this.txt.setText(text.toUpperCase());
  }

  setIcon(icon='', num = undefined) {
    this.icon.setTexture('icon '+icon, num);
  }

  setContent(text='', icon='', num=undefined) {
    if (text != '') { this.setText(text); }
    if (icon != '') { this.setIcon(icon, num); }
    this.icon.x = -( this.txt.text.length*3 + 4 );
  }
}