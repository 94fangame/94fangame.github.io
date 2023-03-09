import { Colors } from "../utils/colors.js";

export default class Congrats extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene);
    console.log("(you won!!)");
    scene.add.bitmapText(160, 136, 'Pixel bold','YOU WON!!!').setOrigin(0.5).setTint(Colors.accent.main);
    scene.add.image(160, 192, 'congrats');
  }
}