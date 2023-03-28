// import Phaser from "phaser";

import { Colors } from "../utils/colors.js";

export const BtnSizes = {ICON:1, SMALL:3, MEDIUM:4, LARGE:6};
export const BtnTypes = {EMPTY:0, COMMON:1, ACCENT:2, CANCEL:3, EASY:4, MEDIUM:5, HARD:6};

export default class Button extends Phaser.GameObjects.Container {
  
  constructor (scene, x, y, type=BtnTypes.COMMON, size=BtnSizes.MEDIUM, icon='', text='') {
    super(scene, x, y);
    
    this.btnSize = size;
    this.img = scene.add.image( 0, 0, 'btn'+(type == BtnTypes.ACCENT ? '-g':'')+'_'+size );
    this.icon = scene.add.image( 0, 0, 'icon ' + icon);
    this.txt = scene.add.bitmapText(0, -1, 'Pixel', text.toUpperCase(), 24)
      .setOrigin(0.5);
    
    this.txt.setScale(0.33);
    if (icon == '') {
      this.icon.setVisible(false);
      this.txt.x = this.img.width/2 - this.txt.width;
      // Phaser.Display.Align.In.Center(this.txt, this.img);
    } else if (text =! '') {
      this.icon.x -= ( this.txt.text.length*3 + 4 );
      this.txt.x += 6;
    }
    
    
    this.add(this.img);
    this.add(this.txt);
    this.add(this.icon);
    this.setSize(this.img.width, this.img.height);
    
    this.Tint = {
      DEFAULT: -1,
      HOVER: -1,
      CLICKED: -1,
    };
    this.setType(type);

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

  setType(type) {
    this.btnType = type;
    this.img.setTexture('btn'+(type == BtnTypes.ACCENT ? '-g':'')+'_'+this.btnSize);
    
    switch (type) {
      case BtnTypes.ACCENT:
        this.setTint(Colors.white, Colors.accent.main, Colors.accent.dark);
        break;
      
      case BtnTypes.COMMON:
        this.setTint(Colors.primary.light, Colors.primary.main, Colors.primary.dark);
        break;
    
      default:
        switch (type) {
          case BtnTypes.CANCEL:
            this.Tint.DEFAULT = Colors.dark; break;
          case BtnTypes.EASY:
            this.Tint.DEFAULT = 0x65AB40; break;
          case BtnTypes.MEDIUM:
            this.Tint.DEFAULT = Colors.accent.dark; break;
          case BtnTypes.HARD:
            this.Tint.DEFAULT = 0xC03533; break;
          default:
            this.Tint.DEFAULT = Colors.light;
        }
        this.setTint(this.Tint.DEFAULT);
        break;
    }
  }

  _checkColor(color) {
    if (color > 0xFFFFFF) { color = 0xFFFFFF; }
    else if (color < 0x000000) { color = 0x000000; }
    return color;
  }
  _blendColors(cmain, cmul) {
    cmain = Phaser.Display.Color.IntegerToColor(cmain);
    cmul = Phaser.Display.Color.IntegerToColor(cmul);
    if (cmain.v < 0.5) { cmul.darken(33); }
    return Phaser.Display.Color.GetColor32(
      cmain.redGL*cmul.redGL*255,
      cmain.greenGL*cmul.greenGL*255,
      cmain.blueGL*cmul.blueGL*255,
      255);
  }

  setTint(main, hover=null, clicked=null) {
    if (main > 0x808080 && this.btnType!=BtnTypes.COMMON) {
      this.txt.setTint(Colors.dark);
    }

    this.Tint.DEFAULT = main;
    this.Tint.HOVER = hover ?? this._blendColors(main, Colors.hover);
    this.Tint.CLICKED = clicked ?? this._blendColors(main, Colors.clicked);
    this.img.setTint(this.Tint.DEFAULT);
  }
}