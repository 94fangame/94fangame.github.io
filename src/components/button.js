// import Phaser from "phaser";

export const BtnSizes = {ICON:1, SMALL:3, MEDIUM:4, LARGE:6};
export const BtnTypes = {COMMON:'btn_', ACCENT:'btn-g_'};

export default class Button extends Phaser.GameObjects.Container {
  
  constructor (scene, x, y, type, size, text) {
    super(scene, x, y);
    
    this.img = scene.add.image( 0, 0, type+size );
    this.txt = scene.add.bitmapText(0, -1,
      'Pixel bold' + (type==BtnTypes.ACCENT ? '':' white'), text.toUpperCase())
      .setOrigin(0.5).setFontSize(8);
    
    this.add(this.img);
    this.add(this.txt);
    this.setSize(this.img.width, this.img.height);
    
    this.Tint = type == BtnTypes.COMMON ?
    {
      DEFAULT: 0xFF2E83,
      HOVER: 0xB42B81,
      CLICKED: 0x3A277D,
    } : {
      DEFAULT: 0xFFFFFF,
      HOVER: 0xFFC713,
      CLICKED: 0xFF8B26,
    };

    this.setInteractive();
    this.img.setTint(this.Tint.DEFAULT);
    this
      .on(Phaser.Input.Events.POINTER_OVER, ()=>{
        this.img.setTint(this.Tint.HOVER);
      })
      .on(Phaser.Input.Events.POINTER_OUT, ()=>{
        this.img.setTint(this.Tint.DEFAULT);
      })
      .on(Phaser.Input.Events.POINTER_DOWN, ()=>{
        this.img.setTint(this.Tint.CLICKED);
      })
      .on(Phaser.Input.Events.POINTER_UP, ()=>{
        this.img.setTint(this.Tint.HOVER);
      })

  }

  setActive(active=true) {
    this.active = active;
    if (active) {
      this.setAlpha(1);
      this.setInteractive();
      this.img.setTint(this.Tint.DEFAULT);
    } else {
      this.removeInteractive();
      this.setAlpha(0.5);
      this.img.setTint(0x281E2E);
    }
  }

  setText(text='') {
    this.txt.setText(text.toUpperCase());
  }
}